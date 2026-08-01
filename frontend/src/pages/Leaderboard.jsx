import React, { useState, useEffect } from 'react';
import hackathonService from '../services/hackathonService';
import submissionService from '../services/submissionService';
import { Trophy, Medal, Search, Loader } from 'lucide-react';

const Leaderboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await hackathonService.getHackathons();
        setHackathons(data);
        if (data.length > 0) {
          setSelectedHackathon(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching hackathons', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedHackathon) return;
      
      setLoadingLeaderboard(true);
      try {
        const data = await submissionService.getLeaderboard(selectedHackathon);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
        setLeaderboard([]);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [selectedHackathon]);

  return (
    <div className="container mx-auto mt-10 p-4 max-w-4xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 flex items-center justify-center gap-3">
          <Trophy size={40} className="text-yellow-500" /> Global Leaderboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">See the top performing teams across all hackathons</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row items-center gap-4 transition-colors">
        <label className="font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">Select Hackathon:</label>
        <select 
          value={selectedHackathon} 
          onChange={(e) => setSelectedHackathon(e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 border-2 border-blue-100 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 font-medium bg-gray-50 dark:bg-gray-700 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <option>Loading hackathons...</option>
          ) : hackathons.length === 0 ? (
            <option>No hackathons available</option>
          ) : (
            hackathons.map((h) => (
              <option key={h._id} value={h._id}>{h.title}</option>
            ))
          )}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        {loadingLeaderboard ? (
          <div className="flex justify-center items-center p-12 text-blue-600 dark:text-blue-400">
            <Loader className="animate-spin mr-2" /> Loading rankings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Trophy className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
            <p>No evaluated submissions for this hackathon yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm border-b dark:border-gray-600">Rank</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm border-b dark:border-gray-600">Team Name</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm border-b dark:border-gray-600">Project Name</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm border-b dark:border-gray-600 text-right">Total Score</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm border-b dark:border-gray-600">Position</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((sub, index) => {
                  // If previous item has same score, use its rank, otherwise use index + 1
                  const rank = index > 0 && leaderboard[index - 1].score === sub.score 
                    ? leaderboard.findIndex(s => s.score === sub.score) + 1 
                    : index + 1;
                    
                  return (
                    <tr key={sub._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                        {rank}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800 dark:text-gray-200">{sub.team?.name || 'Unknown Team'}</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{sub.projectName}</td>
                      <td className="py-4 px-6 text-right font-bold text-blue-600 dark:text-blue-400 text-lg">{sub.score}</td>
                      <td className="py-4 px-6 font-medium">
                        {rank === 1 ? (
                          <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg"><Medal size={20} /> 1st</div>
                        ) : rank === 2 ? (
                          <div className="flex items-center gap-1 text-gray-400 font-bold text-lg"><Medal size={20} /> 2nd</div>
                        ) : rank === 3 ? (
                          <div className="flex items-center gap-1 text-amber-700 font-bold text-lg"><Medal size={20} /> 3rd</div>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400 ml-2">{rank}th</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
