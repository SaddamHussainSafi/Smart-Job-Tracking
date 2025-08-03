import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../../components/Navigation';
import { jobsAPI } from '../../utils/api';

export default function PostJob() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    job_type: 'full_time',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect the route
  if (typeof window !== 'undefined' && (!isAuthenticated || user?.role !== 'employer')) {
    router.replace('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await jobsAPI.create(formData);
      router.push('/dashboard'); // Or a "job posted successfully" page
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Post a New Job - Smart Job Tracker</title>
      </Head>

      <Navigation />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Post a New Job</h1>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="card">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input type="text" name="title" id="title" required className="input-field" value={formData.title} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" name="company" id="company" required className="input-field" value={formData.company} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" name="location" id="location" required className="input-field" value={formData.location} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select name="job_type" id="job_type" required className="input-field" value={formData.job_type} onChange={handleChange}>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary (Optional)</label>
                  <input type="text" name="salary" id="salary" className="input-field" value={formData.salary} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea name="description" id="description" rows="5" required className="input-field" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <textarea name="requirements" id="requirements" rows="5" required className="input-field" value={formData.requirements} onChange={handleChange}></textarea>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Submitting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
