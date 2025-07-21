#!/usr/bin/env python3
"""
Enhanced Backend API Testing for Smart Job Tracker
Focus on testing the enhanced my-applications endpoint and application system improvements
"""

import requests
import json
import time
import sys
from typing import Dict, Any, Optional

# Backend URL from environment
BACKEND_URL = "https://2f24e3f7-369e-430c-babb-ae3802580ea2.preview.emergentagent.com/api"

class EnhancedJobTrackerTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.job_seeker_token = None
        self.employer_token = None
        self.test_job_ids = []
        self.test_application_ids = []
        
        # Generate unique test data with timestamp
        timestamp = str(int(time.time()))
        
        # Test data for job seeker
        self.job_seeker_data = {
            "email": f"enhanced.seeker.{timestamp}@email.com",
            "password": "SecurePass123!",
            "role": "job_seeker",
            "full_name": "Enhanced Test Job Seeker",
            "skills": ["Python", "React", "FastAPI", "MongoDB", "JavaScript"],
            "experience": "5 years of full-stack development with expertise in modern web technologies",
            "education": "Master's in Computer Science from Tech University",
            "phone": "+1-555-0199"
        }
        
        # Test data for employer
        self.employer_data = {
            "email": f"enhanced.hr.{timestamp}@techcorp.com",
            "password": "CompanyPass456!",
            "role": "employer",
            "full_name": "Enhanced Tech Corp HR",
            "company_name": "Enhanced Tech Solutions",
            "company_description": "Leading technology solutions provider specializing in AI and web development"
        }
        
        # Multiple job postings for comprehensive testing
        self.job_postings = [
            {
                "title": "Senior Full Stack Developer",
                "company": "Enhanced Tech Solutions",
                "description": "We are seeking a senior full-stack developer to lead our development team and work on cutting-edge projects.",
                "requirements": "5+ years experience with Python, React, FastAPI, and MongoDB. Strong leadership skills required.",
                "salary": "$90,000 - $120,000",
                "location": "San Francisco, CA",
                "job_type": "full_time"
            },
            {
                "title": "Frontend React Developer",
                "company": "Enhanced Tech Solutions",
                "description": "Join our frontend team to build beautiful and responsive user interfaces using React and modern CSS frameworks.",
                "requirements": "3+ years experience with React, JavaScript, HTML5, CSS3, and responsive design.",
                "salary": "$70,000 - $90,000",
                "location": "Remote",
                "job_type": "full_time"
            },
            {
                "title": "Backend Python Developer",
                "company": "Enhanced Tech Solutions",
                "description": "Work on our backend systems using Python, FastAPI, and MongoDB to build scalable APIs.",
                "requirements": "4+ years experience with Python, FastAPI, MongoDB, and API development.",
                "salary": "$80,000 - $100,000",
                "location": "New York, NY",
                "job_type": "contract"
            }
        ]

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    token: Optional[str] = None, params: Optional[Dict] = None) -> requests.Response:
        """Make HTTP request with optional authentication"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, headers=headers, json=data, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.Timeout as e:
            print(f"❌ Request timeout: {e}")
            return None
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Connection error: {e}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            return None

    def setup_test_environment(self) -> bool:
        """Set up test environment with users and jobs"""
        print("🔧 Setting up test environment...")
        
        # Register job seeker
        print("  Registering job seeker...")
        response = self.make_request("POST", "/auth/register", self.job_seeker_data)
        if not response or response.status_code != 200:
            print(f"  ❌ Job seeker registration failed: {response.status_code if response else 'No response'}")
            return False
        
        job_seeker_result = response.json()
        self.job_seeker_token = job_seeker_result.get("access_token")
        if not self.job_seeker_token:
            print("  ❌ No access token received for job seeker")
            return False
        
        # Register employer
        print("  Registering employer...")
        response = self.make_request("POST", "/auth/register", self.employer_data)
        if not response or response.status_code != 200:
            print(f"  ❌ Employer registration failed: {response.status_code if response else 'No response'}")
            return False
        
        employer_result = response.json()
        self.employer_token = employer_result.get("access_token")
        if not self.employer_token:
            print("  ❌ No access token received for employer")
            return False
        
        # Create multiple job postings
        print("  Creating job postings...")
        for i, job_data in enumerate(self.job_postings):
            response = self.make_request("POST", "/jobs", job_data, token=self.employer_token)
            if not response or response.status_code != 200:
                print(f"  ❌ Job creation {i+1} failed: {response.status_code if response else 'No response'}")
                return False
            
            job_result = response.json()
            job_id = job_result.get("id")
            if job_id:
                self.test_job_ids.append(job_id)
            else:
                print(f"  ❌ No job ID returned for job {i+1}")
                return False
        
        print(f"  ✅ Test environment setup complete ({len(self.test_job_ids)} jobs created)")
        return True

    def test_application_submission(self) -> bool:
        """Test job application submission functionality"""
        print("\n📝 Testing Enhanced Application Submission...")
        
        if not self.test_job_ids:
            print("  ❌ No test jobs available for application")
            return False
        
        # Apply to multiple jobs
        for i, job_id in enumerate(self.test_job_ids):
            print(f"  Testing application to job {i+1}...")
            
            application_data = {
                "job_id": job_id,
                "resume_content": f"Enhanced resume content for {self.job_seeker_data['full_name']} - Application {i+1}",
                "cover_letter_content": f"Enhanced cover letter for position {i+1} - demonstrating strong interest and qualifications"
            }
            
            response = self.make_request("POST", "/applications", application_data, token=self.job_seeker_token)
            
            if not response or response.status_code != 200:
                print(f"  ❌ Application {i+1} failed: {response.status_code if response else 'No response'}")
                if response:
                    print(f"     Response: {response.text}")
                return False
            
            application_result = response.json()
            application_id = application_result.get("id")
            
            if not application_id:
                print(f"  ❌ No application ID returned for application {i+1}")
                return False
            
            self.test_application_ids.append(application_id)
            print(f"  ✅ Application {i+1} submitted successfully")
        
        print(f"  ✅ All {len(self.test_application_ids)} applications submitted successfully")
        return True

    def test_enhanced_my_applications_endpoint(self) -> bool:
        """Test the enhanced my-applications endpoint that returns job details"""
        print("\n🔍 Testing Enhanced My-Applications Endpoint...")
        
        if not self.test_application_ids:
            print("  ❌ No test applications available")
            return False
        
        # Test getting applications with job details
        print("  Testing my-applications endpoint with job details...")
        response = self.make_request("GET", "/my-applications", token=self.job_seeker_token)
        
        if not response or response.status_code != 200:
            print(f"  ❌ My-applications request failed: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        applications = response.json()
        
        # Validate response structure
        if not isinstance(applications, list):
            print("  ❌ Applications response is not a list")
            return False
        
        if len(applications) != len(self.test_application_ids):
            print(f"  ❌ Expected {len(self.test_application_ids)} applications, got {len(applications)}")
            return False
        
        print(f"  ✅ Retrieved {len(applications)} applications")
        
        # Validate each application has proper structure and job details
        for i, app in enumerate(applications):
            print(f"  Validating application {i+1} structure...")
            
            # Check application fields
            required_app_fields = ["id", "job_id", "job_seeker_id", "resume_content", 
                                 "cover_letter_content", "applied_at", "status"]
            
            for field in required_app_fields:
                if field not in app:
                    print(f"  ❌ Missing application field: {field}")
                    return False
            
            # Check job details are included
            if "job" not in app:
                print(f"  ❌ Missing job details in application {i+1}")
                return False
            
            job_details = app["job"]
            required_job_fields = ["id", "title", "company", "description", "requirements", 
                                 "salary", "location", "job_type", "employer_id", "created_at", "is_active"]
            
            for field in required_job_fields:
                if field not in job_details:
                    print(f"  ❌ Missing job field in application {i+1}: {field}")
                    return False
            
            # Validate job ID matches
            if app["job_id"] != job_details["id"]:
                print(f"  ❌ Job ID mismatch in application {i+1}")
                return False
            
            # Validate job seeker ID matches current user
            if app["job_seeker_id"] != self.job_seeker_data.get("id", "unknown"):
                # This is expected since we don't store the user ID, just verify it's present
                if not app["job_seeker_id"]:
                    print(f"  ❌ Missing job seeker ID in application {i+1}")
                    return False
            
            print(f"  ✅ Application {i+1} structure valid with job details")
            print(f"     Job: {job_details['title']} at {job_details['company']}")
            print(f"     Status: {app['status']}")
        
        print("  ✅ All applications have proper structure with complete job details")
        return True

    def test_application_job_relationship(self) -> bool:
        """Test that applications correctly maintain relationship with jobs"""
        print("\n🔗 Testing Application-Job Relationship...")
        
        # Get applications
        response = self.make_request("GET", "/my-applications", token=self.job_seeker_token)
        if not response or response.status_code != 200:
            print("  ❌ Failed to get applications")
            return False
        
        applications = response.json()
        
        # For each application, verify the job details match the original job
        for i, app in enumerate(applications):
            job_id = app["job_id"]
            embedded_job = app["job"]
            
            print(f"  Verifying job relationship for application {i+1}...")
            
            # Get the job directly from jobs endpoint
            response = self.make_request("GET", f"/jobs/{job_id}")
            if not response or response.status_code != 200:
                print(f"  ❌ Failed to get job {job_id} directly")
                return False
            
            direct_job = response.json()
            
            # Compare key fields
            key_fields = ["id", "title", "company", "description", "requirements", "location", "job_type"]
            for field in key_fields:
                if embedded_job.get(field) != direct_job.get(field):
                    print(f"  ❌ Job field mismatch for {field}: embedded='{embedded_job.get(field)}' vs direct='{direct_job.get(field)}'")
                    return False
            
            print(f"  ✅ Job relationship verified for application {i+1}")
        
        print("  ✅ All application-job relationships are correct")
        return True

    def test_role_based_access_control(self) -> bool:
        """Test role-based access control for applications"""
        print("\n🛡️ Testing Role-Based Access Control...")
        
        # Test employer trying to access my-applications (should fail)
        print("  Testing employer access to my-applications (should fail)...")
        response = self.make_request("GET", "/my-applications", token=self.employer_token)
        
        if not response or response.status_code != 403:
            print(f"  ❌ Expected 403 for employer accessing my-applications, got: {response.status_code if response else 'No response'}")
            if response:
                print(f"     Response: {response.text}")
            return False
        
        print("  ✅ Correctly blocked employer from accessing my-applications")
        
        # Test job seeker trying to apply with employer token (should fail)
        print("  Testing job seeker applying with employer token (should fail)...")
        if self.test_job_ids:
            application_data = {
                "job_id": self.test_job_ids[0],
                "resume_content": "Test resume",
                "cover_letter_content": "Test cover letter"
            }
            
            response = self.make_request("POST", "/applications", application_data, token=self.employer_token)
            
            if not response or response.status_code != 403:
                print(f"  ❌ Expected 403 for employer applying to job, got: {response.status_code if response else 'No response'}")
                if response:
                    print(f"     Response: {response.text}")
                return False
            
            print("  ✅ Correctly blocked employer from applying to jobs")
        
        return True

    def test_employer_application_viewing(self) -> bool:
        """Test employer viewing applications for their jobs"""
        print("\n👔 Testing Employer Application Viewing...")
        
        if not self.test_job_ids:
            print("  ❌ No test jobs available")
            return False
        
        # Test employer viewing applications for each of their jobs
        for i, job_id in enumerate(self.test_job_ids):
            print(f"  Testing employer viewing applications for job {i+1}...")
            
            response = self.make_request("GET", f"/job-applications/{job_id}", token=self.employer_token)
            
            if not response or response.status_code != 200:
                print(f"  ❌ Employer application viewing failed for job {i+1}: {response.status_code if response else 'No response'}")
                if response:
                    print(f"     Response: {response.text}")
                return False
            
            job_applications = response.json()
            
            if not isinstance(job_applications, list):
                print(f"  ❌ Invalid job applications format for job {i+1}")
                return False
            
            # Should have exactly 1 application per job (from our test job seeker)
            if len(job_applications) != 1:
                print(f"  ❌ Expected 1 application for job {i+1}, got {len(job_applications)}")
                return False
            
            # Validate application structure includes applicant details
            app = job_applications[0]
            if "applicant" not in app:
                print(f"  ❌ Missing applicant details in job {i+1} applications")
                return False
            
            applicant = app["applicant"]
            required_applicant_fields = ["id", "full_name", "email", "skills", "experience", "education"]
            
            for field in required_applicant_fields:
                if field not in applicant:
                    print(f"  ❌ Missing applicant field in job {i+1}: {field}")
                    return False
            
            print(f"  ✅ Employer can view applications for job {i+1} with applicant details")
        
        print("  ✅ Employer application viewing working correctly")
        return True

    def run_enhanced_tests(self) -> Dict[str, bool]:
        """Run all enhanced backend API tests"""
        print("🚀 Starting Enhanced Backend API Testing for Smart Job Tracker")
        print(f"Backend URL: {self.base_url}")
        print("Focus: Enhanced my-applications endpoint and application system improvements")
        
        test_results = {}
        
        # Setup test environment
        test_results["setup_test_environment"] = self.setup_test_environment()
        if not test_results["setup_test_environment"]:
            print("❌ Test environment setup failed, aborting remaining tests")
            return test_results
        
        # Enhanced Application System Tests
        test_results["application_submission"] = self.test_application_submission()
        test_results["enhanced_my_applications_endpoint"] = self.test_enhanced_my_applications_endpoint()
        test_results["application_job_relationship"] = self.test_application_job_relationship()
        test_results["role_based_access_control"] = self.test_role_based_access_control()
        test_results["employer_application_viewing"] = self.test_employer_application_viewing()
        
        return test_results

def main():
    """Main test execution function"""
    tester = EnhancedJobTrackerTester()
    results = tester.run_enhanced_tests()
    
    print("\n" + "="*80)
    print("📊 ENHANCED BACKEND API TEST RESULTS SUMMARY")
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
        print("\n🎉 All enhanced backend API tests passed successfully!")
        print("✅ Enhanced my-applications endpoint working correctly with job details")
        print("✅ Application submission and retrieval working properly")
        print("✅ Application-job relationships maintained correctly")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please check the detailed output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())