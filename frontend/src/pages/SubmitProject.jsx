import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import submissionService from '../services/submissionService';

const SubmitProject = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const teamId = searchParams.get('teamId');
  const hackathonId = searchParams.get('hackathonId');

  const [formData, setFormData] = useState({
    projectName: '',
    problemStatement: '',
    solution: '',
    description: '',
    githubRepository: '',
    liveDemoUrl: '',
    techStack: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId || !hackathonId) {
      navigate('/dashboard');
    }
  }, [teamId, hackathonId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await submissionService.createSubmission({ ...formData, teamId, hackathonId }, storedUser.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit project');
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Submit Your Project</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Project Name</label>
            <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} required className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Problem Statement</label>
            <textarea name="problemStatement" value={formData.problemStatement} onChange={handleChange} required rows="2" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Solution</label>
            <textarea name="solution" value={formData.solution} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Detailed Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Tech Stack (comma separated)</label>
            <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} required placeholder="React, Node.js, MongoDB" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">GitHub Repository URL</label>
              <input type="url" name="githubRepository" value={formData.githubRepository} onChange={handleChange} required className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Live Demo URL (Optional)</label>
              <input type="url" name="liveDemoUrl" value={formData.liveDemoUrl} onChange={handleChange} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-bold mt-6">
            Submit Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitProject;
