#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Smart Job Tracker
Tests all authentication, job management, AI document generation, and application system endpoints
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL from environment
BACKEND_URL = "https://2f24e3f7-369e-430c-babb-ae3802580ea2.preview.emergentagent.com/api"

class JobTrackerAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.job_seeker_token = None
        self.employer_token = None
        self.test_job_id = None
        self.test_application_id = None
        
        # Test data
        self.job_seeker_data = {
            "email": "sarah.johnson@email.com",
            "password": "SecurePass123!",
            "role": "job_seeker",
            "full_name": "Sarah Johnson",
            "skills": ["Python", "React", "FastAPI", "MongoDB"],
            "experience": "3 years of full-stack development experience",
            "education": "Bachelor's in Computer Science",
            "phone": "+1-555-0123"
        }
        
        self.employer_data = {
            "email": "hr@techcorp.com",
            "password": "CompanyPass456!",
            "role": "employer",
            "full_name": "Tech Corp HR",
            "company_name": "Tech Corp Solutions",
            "company_description": "Leading technology solutions provider"
        }
        
        self.job_data = {
            "title": "Senior Full Stack Developer",
            "company": "Tech Corp Solutions",
            "description": "We are looking for an experienced full-stack developer to join our team.",
            "requirements": "3+ years experience with Python, React, and databases",
            "salary": "$80,000 - $100,000",
            "location": "San Francisco, CA",
            "job_type": "full_time"
        }

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    token: Optional[str] = None, params: Optional[Dict] = None) -> requests.Response:
        """Make HTTP request with optional authentication"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers, params=params, timeout=10)
            elif method.upper() == "POST":
                response = self.session.post(url, headers=headers, json=data, timeout=10)
            elif method.upper() == "PUT":
                response = self.session.put(url, headers=headers, json=data, timeout=10)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            return None

    def test_user_registration(self) -> bool:
        """Test user registration for both job seekers and employers"""
        print("\n🔐 Testing User Registration...")
        
        # Test job seeker registration
        print("  Testing job seeker registration...")
        response = self.make_request("POST", "/auth/register", self.job_seeker_data)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job seeker registration failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        job_seeker_result = response.json()
        self.job_seeker_token = job_seeker_result.get("access_token")
        
        if not self.job_seeker_token:
            print("  ❌ No access token received for job seeker")
            return False
        
        print("  ✅ Job seeker registration successful")
        
        # Test employer registration
        print("  Testing employer registration...")
        response = self.make_request("POST", "/auth/register", self.employer_data)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Employer registration failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        employer_result = response.json()
        self.employer_token = employer_result.get("access_token")
        
        if not self.employer_token:
            print("  ❌ No access token received for employer")
            return False
        
        print("  ✅ Employer registration successful")
        return True

    def test_user_login(self) -> bool:
        """Test user login functionality"""
        print("\n🔑 Testing User Login...")
        
        # Test job seeker login
        print("  Testing job seeker login...")
        login_data = {
            "email": self.job_seeker_data["email"],
            "password": self.job_seeker_data["password"]
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job seeker login failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        result = response.json()
        if not result.get("access_token"):
            print("  ❌ No access token received on login")
            return False
        
        print("  ✅ Job seeker login successful")
        
        # Test employer login
        print("  Testing employer login...")
        login_data = {
            "email": self.employer_data["email"],
            "password": self.employer_data["password"]
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Employer login failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        result = response.json()
        if not result.get("access_token"):
            print("  ❌ No access token received on employer login")
            return False
        
        print("  ✅ Employer login successful")
        return True

    def test_protected_routes(self) -> bool:
        """Test JWT token validation and protected route access"""
        print("\n🛡️ Testing Protected Routes...")
        
        # Test accessing protected route with valid token
        print("  Testing valid token access...")
        response = self.make_request("GET", "/auth/me", token=self.job_seeker_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Protected route access failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        user_data = response.json()
        if user_data.get("email") != self.job_seeker_data["email"]:
            print("  ❌ Wrong user data returned")
            return False
        
        print("  ✅ Valid token access successful")
        
        # Test accessing protected route without token
        print("  Testing access without token...")
        response = self.make_request("GET", "/auth/me")
        
        if not response or response.status_code not in [401, 403]:
            print(f"  ❌ Expected 401/403 for no token, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked access without token")
        
        # Test accessing protected route with invalid token
        print("  Testing access with invalid token...")
        response = self.make_request("GET", "/auth/me", token="invalid_token")
        
        if not response or response.status_code not in [401, 403, 500]:
            print(f"  ❌ Expected 401/403/500 for invalid token, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked access with invalid token")
        return True

    def test_job_creation(self) -> bool:
        """Test job creation by employers"""
        print("\n💼 Testing Job Creation...")
        
        # Test job creation by employer
        print("  Testing job creation by employer...")
        response = self.make_request("POST", "/jobs", self.job_data, token=self.employer_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job creation failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        job_result = response.json()
        self.test_job_id = job_result.get("id")
        
        if not self.test_job_id:
            print("  ❌ No job ID returned")
            return False
        
        print("  ✅ Job creation successful")
        
        # Test job creation by job seeker (should fail)
        print("  Testing job creation by job seeker (should fail)...")
        response = self.make_request("POST", "/jobs", self.job_data, token=self.job_seeker_token)
        
        if not response or response.status_code != 403:
            print(f"  ❌ Expected 403 for job seeker creating job, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked job creation by job seeker")
        return True

    def test_job_listing_and_search(self) -> bool:
        """Test job listing with search and filter functionality"""
        print("\n📋 Testing Job Listing and Search...")
        
        # Test getting all jobs
        print("  Testing job listing...")
        response = self.make_request("GET", "/jobs")
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job listing failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        jobs = response.json()
        if not isinstance(jobs, list) or len(jobs) == 0:
            print("  ❌ No jobs returned or invalid format")
            return False
        
        print(f"  ✅ Job listing successful ({len(jobs)} jobs found)")
        
        # Test job search
        print("  Testing job search...")
        response = self.make_request("GET", "/jobs", params={"search": "Developer"})
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job search failed: {response.status_code if response else 'No response'}")
            return False
        
        search_results = response.json()
        if not isinstance(search_results, list):
            print("  ❌ Invalid search results format")
            return False
        
        print(f"  ✅ Job search successful ({len(search_results)} results)")
        
        # Test job filter by type
        print("  Testing job filter by type...")
        response = self.make_request("GET", "/jobs", params={"job_type": "full_time"})
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job filter failed: {response.status_code if response else 'No response'}")
            return False
        
        filtered_results = response.json()
        if not isinstance(filtered_results, list):
            print("  ❌ Invalid filter results format")
            return False
        
        print(f"  ✅ Job filter successful ({len(filtered_results)} results)")
        return True

    def test_individual_job_retrieval(self) -> bool:
        """Test retrieving individual job details"""
        print("\n🔍 Testing Individual Job Retrieval...")
        
        if not self.test_job_id:
            print("  ❌ No test job ID available")
            return False
        
        response = self.make_request("GET", f"/jobs/{self.test_job_id}")
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job retrieval failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        job_data = response.json()
        if job_data.get("id") != self.test_job_id:
            print("  ❌ Wrong job data returned")
            return False
        
        print("  ✅ Individual job retrieval successful")
        return True

    def test_employer_job_management(self) -> bool:
        """Test employer's job management functionality"""
        print("\n👔 Testing Employer Job Management...")
        
        # Test getting employer's jobs
        print("  Testing employer's job listing...")
        response = self.make_request("GET", "/my-jobs", token=self.employer_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Employer job listing failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        employer_jobs = response.json()
        if not isinstance(employer_jobs, list):
            print("  ❌ Invalid employer jobs format")
            return False
        
        print(f"  ✅ Employer job listing successful ({len(employer_jobs)} jobs)")
        
        # Test job seeker trying to access employer jobs (should fail)
        print("  Testing job seeker access to employer jobs (should fail)...")
        response = self.make_request("GET", "/my-jobs", token=self.job_seeker_token)
        
        if not response or response.status_code != 403:
            print(f"  ❌ Expected 403 for job seeker accessing employer jobs, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked job seeker from employer jobs")
        return True

    def test_ai_document_generation(self) -> bool:
        """Test AI document generation (mock implementation)"""
        print("\n🤖 Testing AI Document Generation...")
        
        # Test resume generation
        print("  Testing resume generation...")
        resume_request = {
            "document_type": "resume"
        }
        
        response = self.make_request("POST", "/generate-document", resume_request, token=self.job_seeker_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Resume generation failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        resume_result = response.json()
        if not resume_result.get("content") or resume_result.get("type") != "resume":
            print("  ❌ Invalid resume generation response")
            return False
        
        print("  ✅ Resume generation successful")
        
        # Test cover letter generation
        print("  Testing cover letter generation...")
        if not self.test_job_id:
            print("  ❌ No test job ID for cover letter generation")
            return False
        
        cover_letter_request = {
            "job_id": self.test_job_id,
            "document_type": "cover_letter"
        }
        
        response = self.make_request("POST", "/generate-document", cover_letter_request, token=self.job_seeker_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Cover letter generation failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        cover_letter_result = response.json()
        if not cover_letter_result.get("content") or cover_letter_result.get("type") != "cover_letter":
            print("  ❌ Invalid cover letter generation response")
            return False
        
        print("  ✅ Cover letter generation successful")
        
        # Test employer trying to generate documents (should fail)
        print("  Testing employer document generation (should fail)...")
        response = self.make_request("POST", "/generate-document", resume_request, token=self.employer_token)
        
        if not response or response.status_code != 403:
            print(f"  ❌ Expected 403 for employer generating documents, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked employer from document generation")
        return True

    def test_job_application_system(self) -> bool:
        """Test job application submission and tracking"""
        print("\n📝 Testing Job Application System...")
        
        if not self.test_job_id:
            print("  ❌ No test job ID for application")
            return False
        
        # Test job application submission
        print("  Testing job application submission...")
        application_data = {
            "job_id": self.test_job_id,
            "resume_content": "Mock resume content for Sarah Johnson",
            "cover_letter_content": "Mock cover letter content for the position"
        }
        
        response = self.make_request("POST", "/applications", application_data, token=self.job_seeker_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Job application failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        application_result = response.json()
        self.test_application_id = application_result.get("id")
        
        if not self.test_application_id:
            print("  ❌ No application ID returned")
            return False
        
        print("  ✅ Job application submission successful")
        
        # Test duplicate application (should fail)
        print("  Testing duplicate application (should fail)...")
        response = self.make_request("POST", "/applications", application_data, token=self.job_seeker_token)
        
        if not response or response.status_code != 400:
            print(f"  ❌ Expected 400 for duplicate application, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked duplicate application")
        
        # Test employer trying to apply (should fail)
        print("  Testing employer application (should fail)...")
        response = self.make_request("POST", "/applications", application_data, token=self.employer_token)
        
        if not response or response.status_code != 403:
            print(f"  ❌ Expected 403 for employer applying, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked employer from applying")
        return True

    def test_application_tracking(self) -> bool:
        """Test application tracking for job seekers"""
        print("\n📊 Testing Application Tracking...")
        
        # Test job seeker viewing their applications
        print("  Testing job seeker application tracking...")
        response = self.make_request("GET", "/my-applications", token=self.job_seeker_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Application tracking failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        applications = response.json()
        if not isinstance(applications, list) or len(applications) == 0:
            print("  ❌ No applications returned or invalid format")
            return False
        
        print(f"  ✅ Application tracking successful ({len(applications)} applications)")
        
        # Test employer trying to view job seeker applications (should fail)
        print("  Testing employer access to job seeker applications (should fail)...")
        response = self.make_request("GET", "/my-applications", token=self.employer_token)
        
        if not response or response.status_code != 403:
            print(f"  ❌ Expected 403 for employer viewing job seeker applications, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked employer from job seeker applications")
        return True

    def test_employer_viewing_applications(self) -> bool:
        """Test employer viewing applications for their jobs"""
        print("\n👀 Testing Employer Application Viewing...")
        
        if not self.test_job_id:
            print("  ❌ No test job ID for viewing applications")
            return False
        
        # Test employer viewing applications for their job
        print("  Testing employer viewing job applications...")
        response = self.make_request("GET", f"/job-applications/{self.test_job_id}", token=self.employer_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ Employer application viewing failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        job_applications = response.json()
        if not isinstance(job_applications, list):
            print("  ❌ Invalid job applications format")
            return False
        
        print(f"  ✅ Employer application viewing successful ({len(job_applications)} applications)")
        
        # Test job seeker trying to view job applications (should fail)
        print("  Testing job seeker access to job applications (should fail)...")
        response = self.make_request("GET", f"/job-applications/{self.test_job_id}", token=self.job_seeker_token)
        
        if not response or response.status_code != 403:
            print(f"  ❌ Expected 403 for job seeker viewing job applications, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked job seeker from viewing job applications")
        return True

    def run_all_tests(self) -> Dict[str, bool]:
        """Run all backend API tests"""
        print("🚀 Starting Comprehensive Backend API Testing for Smart Job Tracker")
        print(f"Backend URL: {self.base_url}")
        
        test_results = {}
        
        # Authentication System Tests
        test_results["user_registration"] = self.test_user_registration()
        test_results["user_login"] = self.test_user_login()
        test_results["protected_routes"] = self.test_protected_routes()
        
        # Job Management Tests
        test_results["job_creation"] = self.test_job_creation()
        test_results["job_listing_search"] = self.test_job_listing_and_search()
        test_results["individual_job_retrieval"] = self.test_individual_job_retrieval()
        test_results["employer_job_management"] = self.test_employer_job_management()
        
        # AI Document Generation Tests
        test_results["ai_document_generation"] = self.test_ai_document_generation()
        
        # Application System Tests
        test_results["job_application_system"] = self.test_job_application_system()
        test_results["application_tracking"] = self.test_application_tracking()
        test_results["employer_viewing_applications"] = self.test_employer_viewing_applications()
        
        return test_results

def main():
    """Main test execution function"""
    tester = JobTrackerAPITester()
    results = tester.run_all_tests()
    
    print("\n" + "="*80)
    print("📊 BACKEND API TEST RESULTS SUMMARY")
    print("="*80)
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal Tests: {len(results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {(passed/len(results)*100):.1f}%")
    
    if failed == 0:
        print("\n🎉 All backend API tests passed successfully!")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please check the detailed output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())