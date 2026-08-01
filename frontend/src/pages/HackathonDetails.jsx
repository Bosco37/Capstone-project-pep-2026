import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import hackathonService from '../services/hackathonService';
import teamService from '../services/teamService';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, Users, Trophy, BookOpen, Clock, Plus, Trash2 } from 'lucide-react';

const HackathonDetails = () => {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamError, setTeamError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const data = await hackathonService.getHackathonById(id);
        setHackathon(data);
      } catch (error) {
        console.error('Error fetching hackathon details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    try {
      setTeamError('');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await teamService.createTeam({ name: teamName, hackathonId: id }, storedUser.token);
      navigate('/dashboard');
    } catch (err) {
      setTeamError(err.response?.data?.message || 'Failed to register team');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this hackathon? This action cannot be undone.')) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        await hackathonService.deleteHackathon(id, storedUser.token);
        navigate('/hackathons');
      } catch (error) {
        console.error('Failed to delete hackathon', error);
        alert(error.response?.data?.message || 'Failed to delete hackathon');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!hackathon) return <div className="text-center mt-10 text-red-600">Hackathon not found</div>;

  return (
    <div className="container mx-auto mt-10 p-4 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 bg-cover bg-center relative" style={{ backgroundImage: `url(${hackathon.bannerImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{hackathon.title}</h1>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">{hackathon.theme}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-semibold">{hackathon.mode}</span>
              {user && (user.role === 'Administrator' || (hackathon.organizer && hackathon.organizer._id === user._id)) && (
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-sm bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 px-3 py-1 rounded-md transition-colors font-medium mt-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(hackathon.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Deadline</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(hackathon.registrationDeadline).toLocaleDateString()}</p>
              </div>
            </div>
            {hackathon.mode === 'Offline' && (
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{hackathon.venue}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Users className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">1 - {hackathon.maximumTeamSize} Members</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Prize Pool</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">${hackathon.prizePool}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2"><BookOpen size={20} /> Description</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{hackathon.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">Rules</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{hackathon.rules}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">Judging Criteria</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{hackathon.judgingCriteria}</p>
          </div>

          <div className="flex justify-center mt-8">
            {user ? (
              user.role === 'Participant' && (
                <div className="w-full max-w-md">
                  {!showTeamForm ? (
                    <button 
                      onClick={() => setShowTeamForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> Register a Team
                    </button>
                  ) : (
                    <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-lg border border-blue-100 dark:border-gray-600 transition-colors">
                      <h4 className="font-bold text-lg mb-4 text-blue-800 dark:text-blue-300">Create Your Team</h4>
                      {teamError && <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 p-2 rounded mb-3 text-sm">{teamError}</div>}
                      <form onSubmit={handleRegisterTeam}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Name</label>
                          <input 
                            type="text" 
                            required 
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Enter awesome team name"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors">
                            Confirm Registration
                          </button>
                          <button type="button" onClick={() => setShowTeamForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 rounded-md transition-colors">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )
            ) : (
              <Link to="/login" className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors">
                Login to Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;
