from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import jwt
import bcrypt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT Secret Key
JWT_SECRET = "your-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Security
security = HTTPBearer()

# Enums
class UserRole(str, Enum):
    JOB_SEEKER = "job_seeker"
    EMPLOYER = "employer"

class JobType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    role: UserRole
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Job Seeker specific fields
    skills: Optional[List[str]] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    phone: Optional[str] = None
    
    # Employer specific fields
    company_name: Optional[str] = None
    company_description: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    role: UserRole
    full_name: str
    skills: Optional[List[str]] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    company_description: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Job(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    description: str
    requirements: str
    salary: Optional[str] = None
    location: str
    job_type: JobType
    employer_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    requirements: str
    salary: Optional[str] = None
    location: str
    job_type: JobType

class Application(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    job_seeker_id: str
    resume_content: str
    cover_letter_content: str
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "applied"

class ApplicationCreate(BaseModel):
    job_id: str
    resume_content: str
    cover_letter_content: str

class AIDocumentRequest(BaseModel):
    job_id: Optional[str] = None
    document_type: str  # "resume" or "cover_letter"

# Mock AI Document Generation
async def generate_mock_resume(user_profile: dict) -> str:
    """Mock resume generation - replace with real Gemini API later"""
    return f"""
{user_profile['full_name']}
Email: {user_profile['email']} | Phone: {user_profile.get('phone', 'Not provided')}

PROFESSIONAL SUMMARY
Experienced professional with strong background in {', '.join(user_profile.get('skills', ['various technologies']))}. 
{user_profile.get('experience', 'Seeking new opportunities to contribute and grow.')}

EDUCATION
{user_profile.get('education', 'Educational background as provided in profile')}

TECHNICAL SKILLS
{', '.join(user_profile.get('skills', ['Problem solving', 'Communication', 'Team collaboration']))}

EXPERIENCE
{user_profile.get('experience', 'Professional experience as outlined in profile')}
"""

async def generate_mock_cover_letter(user_profile: dict, job_details: dict) -> str:
    """Mock cover letter generation - replace with real Gemini API later"""
    return f"""Dear Hiring Manager,

I am writing to express my strong interest in the {job_details['title']} position at {job_details['company']}. 

With my background in {', '.join(user_profile.get('skills', ['relevant technologies']))}, I am confident I would be a valuable addition to your team. My experience includes {user_profile.get('experience', 'various professional experiences')}.

What particularly excites me about this role is the opportunity to work on {job_details['title']} at {job_details['company']}. Based on the job requirements, I believe my skills in {', '.join(user_profile.get('skills', ['key areas'])[:3])} align well with what you're looking for.

I am eager to bring my expertise to {job_details['company']} and contribute to your continued success. Thank you for considering my application.

Sincerely,
{user_profile['full_name']}"""

# Auth Helper Functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_dict = await db.users.find_one({"id": user_id})
        if user_dict is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(**user_dict)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_dict = user_data.dict()
    user_dict["password_hash"] = hash_password(user_data.password)
    del user_dict["password"]
    
    user = User(**user_dict)
    await db.users.insert_one(user.dict())
    
    # Create access token
    access_token = create_access_token({"sub": user.id})
    
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    user_dict = await db.users.find_one({"email": login_data.email})
    if not user_dict:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(**user_dict)
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.post("/jobs", response_model=Job)
async def create_job(job_data: JobCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can post jobs")
    
    job_dict = job_data.dict()
    job_dict["employer_id"] = current_user.id
    job = Job(**job_dict)
    
    await db.jobs.insert_one(job.dict())
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(search: Optional[str] = None, job_type: Optional[JobType] = None):
    query = {"is_active": True}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}}
        ]
    
    if job_type:
        query["job_type"] = job_type
    
    jobs = await db.jobs.find(query).to_list(1000)
    return [Job(**job) for job in jobs]

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job_dict = await db.jobs.find_one({"id": job_id})
    if not job_dict:
        raise HTTPException(status_code=404, detail="Job not found")
    return Job(**job_dict)

@api_router.get("/my-jobs", response_model=List[Job])
async def get_my_jobs(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can view their jobs")
    
    jobs = await db.jobs.find({"employer_id": current_user.id}).to_list(1000)
    return [Job(**job) for job in jobs]

@api_router.post("/generate-document")
async def generate_document(request: AIDocumentRequest, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.JOB_SEEKER:
        raise HTTPException(status_code=403, detail="Only job seekers can generate documents")
    
    user_profile = current_user.dict()
    
    if request.document_type == "resume":
        content = await generate_mock_resume(user_profile)
    elif request.document_type == "cover_letter":
        if not request.job_id:
            raise HTTPException(status_code=400, detail="Job ID required for cover letter")
        
        job_dict = await db.jobs.find_one({"id": request.job_id})
        if not job_dict:
            raise HTTPException(status_code=404, detail="Job not found")
        
        content = await generate_mock_cover_letter(user_profile, job_dict)
    else:
        raise HTTPException(status_code=400, detail="Invalid document type")
    
    return {"content": content, "type": request.document_type}

@api_router.post("/applications", response_model=Application)
async def apply_for_job(application_data: ApplicationCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.JOB_SEEKER:
        raise HTTPException(status_code=403, detail="Only job seekers can apply for jobs")
    
    # Check if job exists
    job_dict = await db.jobs.find_one({"id": application_data.job_id})
    if not job_dict:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if already applied
    existing_application = await db.applications.find_one({
        "job_id": application_data.job_id,
        "job_seeker_id": current_user.id
    })
    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied for this job")
    
    application_dict = application_data.dict()
    application_dict["job_seeker_id"] = current_user.id
    application = Application(**application_dict)
    
    await db.applications.insert_one(application.dict())
    return application

@api_router.get("/my-applications", response_model=List[dict])
async def get_my_applications(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.JOB_SEEKER:
        raise HTTPException(status_code=403, detail="Only job seekers can view their applications")
    
    applications = await db.applications.find({"job_seeker_id": current_user.id}).to_list(1000)
    
    # Fetch job details for each application
    result = []
    for app in applications:
        job_dict = await db.jobs.find_one({"id": app["job_id"]})
        if job_dict:
            result.append({
                **app,
                "job": Job(**job_dict)
            })
    
    return result

@api_router.get("/job-applications/{job_id}")
async def get_job_applications(job_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can view applications")
    
    # Check if job belongs to employer
    job_dict = await db.jobs.find_one({"id": job_id, "employer_id": current_user.id})
    if not job_dict:
        raise HTTPException(status_code=404, detail="Job not found or unauthorized")
    
    applications = await db.applications.find({"job_id": job_id}).to_list(1000)
    
    # Fetch applicant details
    result = []
    for app in applications:
        user_dict = await db.users.find_one({"id": app["job_seeker_id"]})
        if user_dict:
            user = User(**user_dict)
            result.append({
                **app,
                "applicant": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "skills": user.skills,
                    "experience": user.experience,
                    "education": user.education
                }
            })
    
    return result

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()