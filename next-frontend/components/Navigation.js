import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">Smart Job Tracker</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
              Browse Jobs
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
              Contact
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 border-l border-gray-300 pl-4">
                  <span className="text-gray-700">Hello, {user.full_name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link href="/jobs" className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
                Browse Jobs
              </Link>
              <Link href="/contact" className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
                Contact
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
                    Dashboard
                  </Link>
                  <div className="border-t border-gray-200 pt-2">
                    <p className="text-gray-700 px-3 py-2">Hello, {user.full_name}</p>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 border-t border-gray-200 pt-2">
                  <Link href="/auth/login" className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block btn-primary text-center">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}