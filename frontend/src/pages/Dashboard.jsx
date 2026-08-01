import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import teamService from '../services/teamService';
import { Users, Upload } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      if (user?.role === 'Participant') {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          const data = await teamService.getMyTeams(storedUser.token);
          setTeams(data);
        } catch (error) {
          console.error('Error fetching teams', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user]);

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 mb-8 transition-colors">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Dashboard</h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>!</p>
        <div className="mt-6">
          <p className="text-gray-600 dark:text-gray-400">Your role: <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm font-semibold">{user?.role}</span></p>
        </div>
      </div>

      {user?.role === 'Participant' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100"><Users /> My Teams</h3>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading teams...</p>
          ) : teams.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">You haven't joined any teams yet. Register for a hackathon to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.filter(t => t.hackathon).map(team => (
                <div key={team._id} className="border dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 transition-colors">
                  <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">{team.name}</h4>
                  <p className="text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Hackathon: {team.hackathon.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Members: {team.members.length}</p>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Team Roster:</p>
                    <ul className="text-sm mb-4">
                      {team.members.map(member => (
                        <li key={member._id} className="flex justify-between border-b border-gray-200 dark:border-gray-600 py-1 last:border-0 text-gray-800 dark:text-gray-200">
                          <span>{member.name}</span>
                          {member._id === team.leader && <span className="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 px-1 rounded border border-yellow-200 dark:border-yellow-700/50">Leader</span>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {user._id === team.leader && team.hackathon && (
                    <Link
                      to={`/submit-project?teamId=${team._id}&hackathonId=${team.hackathon._id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload size={18} /> Submit Project
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
