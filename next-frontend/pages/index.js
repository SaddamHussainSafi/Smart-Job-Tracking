import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import Navigation from '../components/Navigation'
import { jobsAPI } from '../utils/api'

export default function Home() {
  const { user, loading } = useAuth()
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll()
      setJobs(response.data.slice(0, 6)) // Show only first 6 jobs on home page
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setJobsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Smart Job Tracker - AI-Powered Job Portal</title>
        <meta name="description" content="Find your dream job with AI-powered resume and cover letter generation" />
      </Head>

      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Job Tracker
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              AI-Powered Job Portal for Modern Career Management
            </p>
            <p className="text-lg mb-10 text-blue-100 max-w-3xl mx-auto">
              Find your dream job with intelligent matching, AI-generated resumes and cover letters, 
              and comprehensive application tracking.
            </p>
            <div className="space-x-4">
              {user ? (
                <Link href="/dashboard" className="btn-primary text-lg px-8 py-3 inline-block">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/register" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors inline-block">
                    Get Started
                  </Link>
                  <Link href="/auth/login" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-colors inline-block">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smart Job Tracker?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the latest AI technology with intuitive design to make your job search more effective.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Documents</h3>
              <p className="text-gray-600">
                Generate professional resumes and cover letters tailored to specific job requirements using advanced AI.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Tracking</h3>
              <p className="text-gray-600">
                Keep track of all your applications, interview dates, and follow-ups in one organized dashboard.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">For Everyone</h3>
              <p className="text-gray-600">
                Perfect for both job seekers looking for opportunities and employers wanting to find the best talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Job Opportunities</h2>
            <p className="text-xl text-gray-600">Discover exciting career opportunities from top companies</p>
          </div>

          {jobsLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="card hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <p className="text-gray-500 mb-4">{job.location}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {job.job_type?.replace('_', ' ').toUpperCase() || 'FULL TIME'}
                    </span>
                    <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/jobs" className="btn-primary text-lg px-8 py-3 inline-block">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Smart Job Tracker</h3>
            <p className="text-gray-400 mb-6">AI-Powered Job Portal for Modern Career Management</p>
            <div className="space-x-6">
              <Link href="/jobs" className="text-gray-300 hover:text-white">Jobs</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400">© 2024 Smart Job Tracker. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}