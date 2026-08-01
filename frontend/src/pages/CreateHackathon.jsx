import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import hackathonService from '../services/hackathonService';
import { AuthContext } from '../context/AuthContext';

const CreateHackathon = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    mode: 'Online',
    venue: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    prizePool: '',
    maximumTeamSize: '',
    rules: '',
    judgingCriteria: '',
  });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser?.token) throw new Error('No token found');
      
      await hackathonService.createHackathon(formData, storedUser.token);
      navigate('/hackathons');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create hackathon');
    }
  };

  if (!user || (user.role !== 'Organizer' && user.role !== 'Administrator')) {
    return <div className="text-center mt-10 text-red-600">Unauthorized</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Create New Hackathon</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Theme</label>
              <input type="text" name="theme" value={formData.theme} onChange={handleChange} required className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Mode</label>
              <select name="mode" value={formData.mode} onChange={handleChange} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          {formData.mode === 'Offline' && (
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Venue</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleChange} required={formData.mode === 'Offline'} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          )}

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Registration Deadline</label>
              <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} required className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:[color-scheme:dark]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Prize Pool ($)</label>
              <input type="number" name="prizePool" value={formData.prizePool} onChange={handleChange} required min="0" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Max Team Size</label>
              <input type="number" name="maximumTeamSize" value={formData.maximumTeamSize} onChange={handleChange} required min="1" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Rules</label>
            <textarea name="rules" value={formData.rules} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Judging Criteria</label>
            <textarea name="judgingCriteria" value={formData.judgingCriteria} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-bold mt-6">
            Create Hackathon
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathon;
