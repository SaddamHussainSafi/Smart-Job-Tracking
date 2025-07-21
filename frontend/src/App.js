import React, { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">Smart Job Tracker</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">Browse Jobs</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Hello, {user.full_name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <span className="text-xl font-bold">Smart Job Tracker</span>
            </div>
            <p className="text-gray-400">
              Connecting talented individuals with amazing opportunities through AI-powered job matching.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Profile</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">My Applications</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/register" className="hover:text-white transition-colors">Post Jobs</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Manage Jobs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Sales</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Smart Job Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Home Page with Enhanced Sections
const Home = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  
  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs?limit=6`);
      setFeaturedJobs(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      company: "Tech Corp",
      image: "https://images.unsplash.com/photo-1494790108755-2616b150b09b?w=150&h=150&fit=crop&crop=face",
      text: "Found my dream job in just 2 weeks! The AI-generated resume was perfect for the role."
    },
    {
      name: "Michael Chen",
      role: "Product Manager", 
      company: "StartupCorp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "The platform made job hunting so much easier. Love the personalized cover letters!"
    },
    {
      name: "Lisa Rodriguez",
      role: "HR Director",
      company: "Digital Solutions",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "As an employer, I found qualified candidates quickly. Great talent pool!"
    }
  ];

  const companies = [
    { name: "Microsoft", logo: "https://img.logos-world.net/wp-content/uploads/2020/09/Microsoft-Symbol.png" },
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Job Tracker
              <span className="block text-blue-600">AI-Powered Job Portal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find your dream job or perfect candidate with AI-generated resumes and cover letters. 
              Connect employers with job seekers seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/jobs')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all"
              >
                Browse Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Smart Job Tracker?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Generated Documents</h3>
              <p className="text-gray-600">Create professional resumes and cover letters with AI assistance tailored to each job application.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Job Search</h3>
              <p className="text-gray-600">Find the perfect job with intelligent filters and search capabilities across multiple categories.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-all">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Employer Dashboard</h3>
              <p className="text-gray-600">Post jobs, manage applications, and find the best candidates for your company with ease.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-gray-600">Discover exciting opportunities from top companies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                    <p className="text-gray-600 text-sm">{job.location}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {job.job_type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex justify-between items-center">
                  {job.salary && (
                    <p className="text-green-600 font-medium text-sm">{job.salary}</p>
                  )}
                  <Link
                    to={`/job/${job.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div id="about" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Smart Job Tracker</h2>
              <p className="text-gray-600 mb-6">
                We're revolutionizing the job search experience with cutting-edge AI technology. Our platform connects 
                talented professionals with amazing opportunities while helping companies find the perfect candidates.
              </p>
              <p className="text-gray-600 mb-6">
                Founded in 2024, we've helped thousands of job seekers land their dream jobs and enabled companies 
                to build exceptional teams. Our AI-powered tools make the application process seamless and effective.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">2024</div>
                  <div className="text-gray-600">Founded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">50K+</div>
                  <div className="text-gray-600">Users</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                alt="Team collaboration" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600">Real success stories from job seekers and employers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                <div className="flex text-yellow-400 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Hiring Companies */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Hiring Companies</h2>
            <p className="text-gray-600">Join thousands of professionals at leading companies</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="w-full h-12 object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Job?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who found their perfect match with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all"
            >
              Browse Jobs Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Contact Page
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">We'd love to hear from you. Get in touch with our team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="6"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@smartjobtracker.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">123 Innovation Street<br/>San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Enhanced Jobs Page with Card Layout
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    try {
      let url = `${API}/jobs?search=${search}`;
      if (jobType) url += `&job_type=${jobType}`;
      const response = await axios.get(url);
      setJobs(response.data);
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Jobs</h1>
          
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search jobs, companies, or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Job Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Search Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h2>
                      <p className="text-blue-600 font-medium mb-1">{job.company}</p>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        {job.location}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                      {job.job_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      {job.salary && (
                        <p className="text-green-600 font-semibold">{job.salary}</p>
                      )}
                      <p className="text-gray-500 text-sm">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/job/${job.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Register Page
const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'job_seeker',
    full_name: '',
    skills: '',
    experience: '',
    education: '',
    phone: '',
    company_name: '',
    company_description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
      };

      const response = await axios.post(`${API}/auth/register`, payload);
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="job_seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
            </div>

            {formData.role === 'job_seeker' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="e.g., JavaScript, Python, React"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {formData.role === 'employer' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Description</label>
                  <textarea
                    value={formData.company_description}
                    onChange={(e) => setFormData({...formData, company_description: e.target.value})}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Login Page
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Enhanced Job Details Page with Upload and Generate Options
const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    resume_content: '',
    cover_letter_content: ''
  });
  const [applying, setApplying] = useState(false);
  const [documentLoading, setDocumentLoading] = useState({ resume: false, coverLetter: false });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${API}/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    }
    setLoading(false);
  };

  const generateDocument = async (type) => {
    setDocumentLoading({ ...documentLoading, [type === 'resume' ? 'resume' : 'coverLetter']: true });
    try {
      const response = await axios.post(`${API}/generate-document`, {
        job_id: id,
        document_type: type
      });
      
      if (type === 'resume') {
        setApplicationData(prev => ({ ...prev, resume_content: response.data.content }));
      } else {
        setApplicationData(prev => ({ ...prev, cover_letter_content: response.data.content }));
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please try again.');
    }
    setDocumentLoading({ ...documentLoading, [type === 'resume' ? 'resume' : 'coverLetter']: false });
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        if (type === 'resume') {
          setApplicationData(prev => ({ ...prev, resume_content: content }));
        } else {
          setApplicationData(prev => ({ ...prev, cover_letter_content: content }));
        }
      };
      reader.readAsText(file);
    }
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await axios.post(`${API}/applications`, {
        job_id: id,
        ...applicationData
      });
      alert('Application submitted successfully!');
      setShowApplication(false);
    } catch (error) {
      alert(error.response?.data?.detail || 'Error submitting application');
    }
    setApplying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Job not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-blue-600 font-medium">{job.company}</p>
              <p className="text-gray-600 flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                {job.location}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                {job.job_type.replace('_', ' ').toUpperCase()}
              </span>
              {job.salary && (
                <p className="text-green-600 font-medium mt-2 text-lg">{job.salary}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
              <p className="text-gray-700 leading-relaxed">{job.requirements}</p>
            </div>

            <div className="border-t pt-6">
              <p className="text-gray-500 mb-6">Posted {new Date(job.created_at).toLocaleDateString()}</p>
              
              {isAuthenticated && user?.role === 'job_seeker' ? (
                <button
                  onClick={() => setShowApplication(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                >
                  Apply Now with AI Assistance
                </button>
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block"
                >
                  Login to Apply
                </Link>
              ) : (
                <p className="text-gray-600">Only job seekers can apply for jobs.</p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Application Modal */}
        {showApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
                  <button
                    onClick={() => setShowApplication(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Resume Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Resume</h3>
                      <div className="flex gap-2">
                        <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                          📄 Upload File
                          <input
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            onChange={(e) => handleFileUpload('resume', e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => generateDocument('resume')}
                          disabled={documentLoading.resume}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {documentLoading.resume ? '⏳ Generating...' : '🤖 Generate with AI'}
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={applicationData.resume_content}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, resume_content: e.target.value }))}
                      placeholder="Upload your resume file or generate one using AI..."
                      rows="10"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Cover Letter Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Cover Letter</h3>
                      <div className="flex gap-2">
                        <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                          📄 Upload File
                          <input
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            onChange={(e) => handleFileUpload('cover_letter', e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => generateDocument('cover_letter')}
                          disabled={documentLoading.coverLetter}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {documentLoading.coverLetter ? '⏳ Generating...' : '🤖 Generate with AI'}
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={applicationData.cover_letter_content}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, cover_letter_content: e.target.value }))}
                      placeholder="Upload your cover letter file or generate one using AI..."
                      rows="8"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowApplication(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitApplication}
                      disabled={applying || !applicationData.resume_content || !applicationData.cover_letter_content}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'employer') {
    return <EmployerDashboard />;
  } else {
    return <JobSeekerDashboard />;
  }
};

// Enhanced Job Seeker Dashboard
const JobSeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API}/my-applications`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Seeker Dashboard</h1>
          <p className="text-gray-600">Track your applications and find new opportunities</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications ({applications.length})</h2>
            
            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-4">Start applying to jobs to see your applications here.</p>
                <Link
                  to="/jobs"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.job?.title}</h3>
                        <p className="text-blue-600">{app.job?.company}</p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          {app.job?.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          {app.status.toUpperCase()}
                        </span>
                        <p className="text-gray-500 text-sm mt-1">
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {app.job?.salary && (
                      <p className="text-green-600 font-medium mb-2">{app.job.salary}</p>
                    )}
                    
                    <Link
                      to={`/job/${app.job_id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Job Details →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/jobs"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                >
                  Browse New Jobs
                </Link>
                <button
                  onClick={fetchApplications}
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                >
                  Refresh Applications
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-semibold text-blue-600">{applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-green-600">
                    {applications.filter(app => {
                      const appDate = new Date(app.applied_at);
                      const now = new Date();
                      return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Enhanced Employer Dashboard
const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await axios.get(`${API}/my-jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
            <p className="text-gray-600">Manage your job postings and applications</p>
          </div>
          <button
            onClick={() => setShowCreateJob(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Post New Job
          </button>
        </div>

        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
              <p className="text-gray-600 mb-4">Create your first job posting to start finding great candidates.</p>
              <button
                onClick={() => setShowCreateJob(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <EmployerJobCard key={job.id} job={job} />
            ))
          )}
        </div>

        {showCreateJob && (
          <CreateJobModal onClose={() => setShowCreateJob(false)} onSuccess={fetchMyJobs} />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Employer Job Card Component
const EmployerJobCard = ({ job }) => {
  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/job-applications/${job.id}`);
      setApplications(response.data);
      setShowApplications(true);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
          <p className="text-blue-600 font-medium">{job.company}</p>
          <p className="text-gray-600 flex items-center mt-1">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            {job.location}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {job.is_active ? 'Active' : 'Inactive'}
          </span>
          {job.salary && (
            <p className="text-green-600 font-medium mt-2">{job.salary}</p>
          )}
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">
          Posted {new Date(job.created_at).toLocaleDateString()}
        </p>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'View Applications'}
        </button>
      </div>

      {showApplications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Applications for {job.title}</h2>
                <button
                  onClick={() => setShowApplications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                  </svg>
                </button>
              </div>

              {applications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No applications yet.</p>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">{app.applicant.full_name}</h3>
                        <p className="text-gray-600">{app.applicant.email}</p>
                        <p className="text-sm text-gray-500">
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Resume</h4>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <pre className="text-sm whitespace-pre-wrap">{app.resume_content}</pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Cover Letter</h4>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <pre className="text-sm whitespace-pre-wrap">{app.cover_letter_content}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Create Job Modal
const CreateJobModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    job_type: 'full_time'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/jobs`, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating job');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Post New Job</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={formData.job_type}
                  onChange={(e) => setFormData({...formData, job_type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Optional)</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  placeholder="e.g., $50,000 - $70,000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <textarea
                required
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;