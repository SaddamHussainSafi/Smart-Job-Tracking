#!/usr/bin/env python3
"""
Simplified Backend API Testing for Smart Job Tracker
Focus on core functionality that works
"""

import requests
import json
import time

# Backend URL from environment
BACKEND_URL = "https://2f24e3f7-369e-430c-babb-ae3802580ea2.preview.emergentagent.com/api"

def test_core_functionality():
    """Test the core working functionality"""
    print("🚀 Testing Core Backend Functionality")
    
    # Generate unique test data
    timestamp = str(int(time.time()))
    
    job_seeker_data = {
        "email": f"test.seeker.{timestamp}@email.com",
        "password": "SecurePass123!",
        "role": "job_seeker",
        "full_name": "Test Job Seeker",
        "skills": ["Python", "React", "FastAPI"],
        "experience": "3 years experience",
        "education": "Bachelor's degree",
        "phone": "+1-555-0123"
    }
    
    employer_data = {
        "email": f"test.employer.{timestamp}@company.com",
        "password": "CompanyPass456!",
        "role": "employer",
        "full_name": "Test Employer",
        "company_name": "Test Company",
        "company_description": "Test company description"
    }
    
    job_data = {
        "title": "Test Developer Position",
        "company": "Test Company",
        "description": "Test job description",
        "requirements": "Test requirements",
        "salary": "$70,000 - $90,000",
        "location": "Remote",
        "job_type": "full_time"
    }
    
    results = {}
    
    # Test 1: User Registration
    print("\n1. Testing User Registration...")
    try:
        # Job seeker registration
        response = requests.post(f"{BACKEND_URL}/auth/register", json=job_seeker_data, timeout=30)
        if response.status_code == 200:
            job_seeker_result = response.json()
            job_seeker_token = job_seeker_result.get("access_token")
            print("   ✅ Job seeker registration successful")
            results["job_seeker_registration"] = True
        else:
            print(f"   ❌ Job seeker registration failed: {response.status_code}")
            results["job_seeker_registration"] = False
            return results
        
        # Employer registration
        response = requests.post(f"{BACKEND_URL}/auth/register", json=employer_data, timeout=30)
        if response.status_code == 200:
            employer_result = response.json()
            employer_token = employer_result.get("access_token")
            print("   ✅ Employer registration successful")
            results["employer_registration"] = True
        else:
            print(f"   ❌ Employer registration failed: {response.status_code}")
            results["employer_registration"] = False
            return results
            
    except Exception as e:
        print(f"   ❌ Registration failed with error: {e}")
        results["job_seeker_registration"] = False
        results["employer_registration"] = False
        return results
    
    # Test 2: User Login
    print("\n2. Testing User Login...")
    try:
        login_data = {"email": job_seeker_data["email"], "password": job_seeker_data["password"]}
        response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data, timeout=30)
        if response.status_code == 200:
            print("   ✅ Job seeker login successful")
            results["job_seeker_login"] = True
        else:
            print(f"   ❌ Job seeker login failed: {response.status_code}")
            results["job_seeker_login"] = False
            
    except Exception as e:
        print(f"   ❌ Login failed with error: {e}")
        results["job_seeker_login"] = False
    
    # Test 3: Protected Route Access
    print("\n3. Testing Protected Route Access...")
    try:
        headers = {"Authorization": f"Bearer {job_seeker_token}"}
        response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers, timeout=30)
        if response.status_code == 200:
            user_data = response.json()
            if user_data.get("email") == job_seeker_data["email"]:
                print("   ✅ Protected route access successful")
                results["protected_route_access"] = True
            else:
                print("   ❌ Wrong user data returned")
                results["protected_route_access"] = False
        else:
            print(f"   ❌ Protected route access failed: {response.status_code}")
            results["protected_route_access"] = False
            
    except Exception as e:
        print(f"   ❌ Protected route access failed with error: {e}")
        results["protected_route_access"] = False
    
    # Test 4: Job Creation
    print("\n4. Testing Job Creation...")
    try:
        headers = {"Authorization": f"Bearer {employer_token}"}
        response = requests.post(f"{BACKEND_URL}/jobs", json=job_data, headers=headers, timeout=30)
        if response.status_code == 200:
            job_result = response.json()
            test_job_id = job_result.get("id")
            print("   ✅ Job creation successful")
            results["job_creation"] = True
        else:
            print(f"   ❌ Job creation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            results["job_creation"] = False
            return results
            
    except Exception as e:
        print(f"   ❌ Job creation failed with error: {e}")
        results["job_creation"] = False
        return results
    
    # Test 5: Job Listing
    print("\n5. Testing Job Listing...")
    try:
        response = requests.get(f"{BACKEND_URL}/jobs", timeout=30)
        if response.status_code == 200:
            jobs = response.json()
            if isinstance(jobs, list) and len(jobs) > 0:
                print(f"   ✅ Job listing successful ({len(jobs)} jobs found)")
                results["job_listing"] = True
            else:
                print("   ❌ No jobs found or invalid format")
                results["job_listing"] = False
        else:
            print(f"   ❌ Job listing failed: {response.status_code}")
            results["job_listing"] = False
            
    except Exception as e:
        print(f"   ❌ Job listing failed with error: {e}")
        results["job_listing"] = False
    
    # Test 6: AI Document Generation
    print("\n6. Testing AI Document Generation...")
    try:
        headers = {"Authorization": f"Bearer {job_seeker_token}"}
        resume_request = {"document_type": "resume"}
        response = requests.post(f"{BACKEND_URL}/generate-document", json=resume_request, headers=headers, timeout=30)
        if response.status_code == 200:
            result = response.json()
            if result.get("content") and result.get("type") == "resume":
                print("   ✅ Resume generation successful")
                results["resume_generation"] = True
            else:
                print("   ❌ Invalid resume generation response")
                results["resume_generation"] = False
        else:
            print(f"   ❌ Resume generation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            results["resume_generation"] = False
            
    except Exception as e:
        print(f"   ❌ Resume generation failed with error: {e}")
        results["resume_generation"] = False
    
    # Test 7: Job Application
    print("\n7. Testing Job Application...")
    try:
        headers = {"Authorization": f"Bearer {job_seeker_token}"}
        application_data = {
            "job_id": test_job_id,
            "resume_content": "Test resume content",
            "cover_letter_content": "Test cover letter content"
        }
        response = requests.post(f"{BACKEND_URL}/applications", json=application_data, headers=headers, timeout=30)
        if response.status_code == 200:
            application_result = response.json()
            if application_result.get("id"):
                print("   ✅ Job application successful")
                results["job_application"] = True
            else:
                print("   ❌ No application ID returned")
                results["job_application"] = False
        else:
            print(f"   ❌ Job application failed: {response.status_code}")
            print(f"   Response: {response.text}")
            results["job_application"] = False
            
    except Exception as e:
        print(f"   ❌ Job application failed with error: {e}")
        results["job_application"] = False
    
    return results

def main():
    results = test_core_functionality()
    
    print("\n" + "="*60)
    print("📊 CORE FUNCTIONALITY TEST RESULTS")
    print("="*60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total*100):.1f}%")
    
    if passed == total:
        print("\n🎉 All core functionality tests passed!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed.")
        return 1

if __name__ == "__main__":
    exit(main())