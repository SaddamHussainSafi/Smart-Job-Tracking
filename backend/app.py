import os
import logging
from pathlib import Path
from datetime import datetime, timedelta
import uuid
import jwt
import bcrypt
from functools import wraps

from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
def get_db():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
    client = MongoClient(mongo_url)
    return client[os.environ.get('DB_NAME', 'smart_job_tracker')]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def create_app():
    app = Flask(__name__)
    
    # CORS configuration
    CORS(app, origins=["*"], allow_headers=["*"], methods=["*"])
    
    # JWT Helper Functions
    def generate_token(user_id, role):
        payload = {
            'user_id': user_id,
            'role': role,
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    def verify_token(token):
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def require_auth(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({'error': 'No authorization header'}), 401
            
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
                payload = verify_token(token)
                if not payload:
                    return jsonify({'error': 'Invalid token'}), 401
                
                request.current_user = payload
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': 'Invalid authorization header'}), 401
        
        return decorated
    
    # Password hashing
    def hash_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(password, hashed):
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    # Mock AI Functions
    def generate_mock_resume(user_profile):
        skills = ', '.join(user_profile.get('skills', ['Problem solving', 'Communication']))
        return f"""
{user_profile['full_name']}
Email: {user_profile['email']} | Phone: {user_profile.get('phone', 'Not provided')}

PROFESSIONAL SUMMARY
Experienced professional with strong background in {skills}. 
{user_profile.get('experience', 'Seeking new opportunities to contribute and grow.')}

EDUCATION
{user_profile.get('education', 'Educational background as provided in profile')}

TECHNICAL SKILLS
{skills}

EXPERIENCE
{user_profile.get('experience', 'Professional experience as outlined in profile')}
"""
    
    def generate_mock_cover_letter(user_profile, job_details):
        return f"""Dear Hiring Manager,

I am writing to express my strong interest in the {job_details['title']} position at {job_details['company']}.

With my background in {', '.join(user_profile.get('skills', ['various technologies']))}, I am confident that I would be a valuable addition to your team.

{user_profile.get('experience', 'My experience has prepared me well for this role.')}

I look forward to discussing how my skills and enthusiasm can contribute to {job_details['company']}'s continued success.

Sincerely,
{user_profile['full_name']}"""
    
    # Routes
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})
    
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        try:
            data = request.json
            db = get_db()
            
            # Check if user exists
            if db.users.find_one({'email': data['email']}):
                return jsonify({'error': 'User already exists'}), 400
            
            # Create user
            user = {
                'id': str(uuid.uuid4()),
                'email': data['email'],
                'password_hash': hash_password(data['password']),
                'role': data['role'],
                'full_name': data['full_name'],
                'created_at': datetime.utcnow(),
                'skills': data.get('skills', []),
                'experience': data.get('experience'),
                'education': data.get('education'),
                'phone': data.get('phone'),
                'company_name': data.get('company_name'),
                'company_description': data.get('company_description')
            }
            
            db.users.insert_one(user)
            
            # Generate token
            token = generate_token(user['id'], user['role'])
            
            # Remove password hash from response
            user.pop('password_hash')
            
            return jsonify({
                'token': token,
                'user': user
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        try:
            data = request.json
            db = get_db()
            
            user = db.users.find_one({'email': data['email']})
            if not user or not verify_password(data['password'], user['password_hash']):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            token = generate_token(user['id'], user['role'])
            
            # Remove password hash from response
            user.pop('password_hash')
            user['_id'] = str(user['_id'])
            
            return jsonify({
                'token': token,
                'user': user
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/auth/me', methods=['GET'])
    @require_auth
    def get_current_user():
        try:
            db = get_db()
            user = db.users.find_one({'id': request.current_user['user_id']})
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            user.pop('password_hash', None)
            user['_id'] = str(user['_id'])
            
            return jsonify(user)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/jobs', methods=['GET'])
    def get_jobs():
        try:
            db = get_db()
            jobs = list(db.jobs.find({'is_active': True}))
            
            for job in jobs:
                job['_id'] = str(job['_id'])
            
            return jsonify(jobs)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/jobs', methods=['POST'])
    @require_auth
    def create_job():
        try:
            if request.current_user['role'] != 'employer':
                return jsonify({'error': 'Only employers can create jobs'}), 403
            
            data = request.json
            db = get_db()
            
            job = {
                'id': str(uuid.uuid4()),
                'title': data['title'],
                'company': data['company'],
                'description': data['description'],
                'requirements': data['requirements'],
                'salary': data.get('salary'),
                'location': data['location'],
                'job_type': data['job_type'],
                'employer_id': request.current_user['user_id'],
                'created_at': datetime.utcnow(),
                'is_active': True
            }
            
            db.jobs.insert_one(job)
            job['_id'] = str(job['_id'])
            
            return jsonify(job)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/jobs/<job_id>', methods=['GET'])
    def get_job(job_id):
        try:
            db = get_db()
            job = db.jobs.find_one({'id': job_id})
            if not job:
                return jsonify({'error': 'Job not found'}), 404
            
            job['_id'] = str(job['_id'])
            return jsonify(job)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/applications', methods=['POST'])
    @require_auth
    def apply_to_job():
        try:
            if request.current_user['role'] != 'job_seeker':
                return jsonify({'error': 'Only job seekers can apply to jobs'}), 403
            
            data = request.json
            db = get_db()
            
            # Check if already applied
            existing = db.applications.find_one({
                'job_id': data['job_id'],
                'job_seeker_id': request.current_user['user_id']
            })
            if existing:
                return jsonify({'error': 'Already applied to this job'}), 400
            
            application = {
                'id': str(uuid.uuid4()),
                'job_id': data['job_id'],
                'job_seeker_id': request.current_user['user_id'],
                'resume_content': data['resume_content'],
                'cover_letter_content': data['cover_letter_content'],
                'applied_at': datetime.utcnow(),
                'status': 'applied'
            }
            
            db.applications.insert_one(application)
            application['_id'] = str(application['_id'])
            
            return jsonify(application)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/applications', methods=['GET'])
    @require_auth
    def get_applications():
        try:
            db = get_db()
            
            if request.current_user['role'] == 'job_seeker':
                applications = list(db.applications.find({
                    'job_seeker_id': request.current_user['user_id']
                }))
            else:  # employer
                # Get applications for employer's jobs
                employer_jobs = list(db.jobs.find({
                    'employer_id': request.current_user['user_id']
                }))
                job_ids = [job['id'] for job in employer_jobs]
                applications = list(db.applications.find({
                    'job_id': {'$in': job_ids}
                }))
            
            for app in applications:
                app['_id'] = str(app['_id'])
            
            return jsonify(applications)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/ai/generate', methods=['POST'])
    @require_auth
    def generate_document():
        try:
            data = request.json
            db = get_db()
            
            # Get user profile
            user = db.users.find_one({'id': request.current_user['user_id']})
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            if data['document_type'] == 'resume':
                content = generate_mock_resume(user)
            elif data['document_type'] == 'cover_letter':
                job_id = data.get('job_id')
                if job_id:
                    job = db.jobs.find_one({'id': job_id})
                    if job:
                        content = generate_mock_cover_letter(user, job)
                    else:
                        return jsonify({'error': 'Job not found'}), 404
                else:
                    content = generate_mock_cover_letter(user, {
                        'title': 'Position',
                        'company': 'Company'
                    })
            else:
                return jsonify({'error': 'Invalid document type'}), 400
            
            return jsonify({'content': content})
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return app