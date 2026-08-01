import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import hackathonService from '../services/hackathonService';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';

const defaultImages = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Laptop workspace
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Team collaboration
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Whiteboard brainstorming
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Modern workspace
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'  // Glowing code
];

const getImageForHackathon = (id) => {
  if (!id) return defaultImages[0];
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return defaultImages[hash % defaultImages.length];
};

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        let queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (filterMode) queryParams.append('mode', filterMode);
        if (filterStatus) queryParams.append('status', filterStatus);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const data = await hackathonService.getHackathons(queryString);
        setHackathons(data);
      } catch (error) {
        console.error('Error fetching hackathons', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchHackathons();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterMode, filterStatus]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Discover Hackathons</h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search hackathons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={filterMode} 
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : hackathons.length === 0 ? (
        <p className="text-gray-600">No hackathons available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <div key={hackathon._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow group">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${hackathon.bannerImage || getImageForHackathon(hackathon._id)})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{hackathon.title}</h3>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded font-semibold">{hackathon.mode}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{hackathon.description}</p>
                
                <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
                  </div>
                  {hackathon.mode === 'Offline' && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="line-clamp-1">{hackathon.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>Max Team: {hackathon.maximumTeamSize}</span>
                  </div>
                </div>

                <Link to={`/hackathons/${hackathon._id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 rounded transition-colors">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonList;
