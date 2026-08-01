import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import submissionService from '../services/submissionService';
import { CheckCircle, ExternalLink, Code } from 'lucide-react';

const JudgeDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [evalError, setEvalError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (user?.role === 'Judge' || user?.role === 'Administrator' || user?.role === 'Organizer') {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          const data = await submissionService.getSubmissions(storedUser.token);
          setSubmissions(data);
        } catch (error) {
          console.error('Error fetching submissions', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubmissions();
  }, [user]);

  const handleEvaluateSubmit = async (e, id) => {
    e.preventDefault();
    try {
      setEvalError('');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      await submissionService.evaluateSubmission(id, { score: Number(score), feedback }, storedUser.token);
      
      setSubmissions(submissions.map(sub => sub._id === id ? { ...sub, score: Number(score), feedback, status: 'Under Review' } : sub));
      setEvaluating(null);
    } catch (err) {
      setEvalError(err.response?.data?.message || 'Evaluation failed');
    }
  };

  if (user?.role !== 'Judge' && user?.role !== 'Administrator' && user?.role !== 'Organizer') {
    return <div className="text-center mt-10 text-red-600">Unauthorized</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Review Submissions</h2>
      </div>

      {loading ? (
        <div className="text-center dark:text-gray-300">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded shadow border dark:border-gray-700">No submissions found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.filter(sub => sub.hackathon && sub.team).map((sub) => (
            <div key={sub._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row transition-colors">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{sub.projectName}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${sub.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400' : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400'}`}>
                    {sub.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-semibold">Team: {sub.team?.name} • Hackathon: {sub.hackathon?.title}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm uppercase mb-1">Problem Statement</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded transition-colors">{sub.problemStatement}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm uppercase mb-1">Solution & Tech</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded mb-2 transition-colors">{sub.solution}</p>
                  <p className="text-sm dark:text-gray-300"><span className="font-semibold">Tech Stack:</span> {sub.techStack}</p>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <a href={sub.githubRepository} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline font-medium">
                    <Code size={16} /> GitHub Repo
                  </a>
                  {sub.liveDemoUrl && (
                    <a href={sub.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 transition-colors">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 dark:text-gray-100"><CheckCircle size={20} /> Evaluation</h4>
                
                {sub.score > 0 && evaluating !== sub._id ? (
                  <div>
                    <div className="mb-4 flex items-center justify-between bg-white dark:bg-gray-800 p-3 border dark:border-gray-600 rounded transition-colors">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Score:</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sub.score}<span className="text-sm text-gray-400 dark:text-gray-500">/100</span></span>
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Feedback:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 border dark:border-gray-600 rounded italic transition-colors">"{sub.feedback}"</p>
                    </div>
                    {(user.role === 'Judge' || user.role === 'Administrator') && (
                      <button onClick={() => { setEvaluating(sub._id); setScore(sub.score); setFeedback(sub.feedback || ''); }} className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2">
                        Edit Evaluation
                      </button>
                    )}
                  </div>
                ) : evaluating === sub._id ? (
                  <form onSubmit={(e) => handleEvaluateSubmit(e, sub._id)}>
                    {evalError && <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 border dark:border-red-800/50 p-2 text-xs rounded mb-2">{evalError}</div>}
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Score (0-100)</label>
                      <input type="number" min="0" max="100" required value={score} onChange={(e) => setScore(e.target.value)} className="w-full px-3 py-2 border dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Feedback</label>
                      <textarea required rows="3" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full px-3 py-2 border dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold transition-colors">Submit</button>
                      <button type="button" onClick={() => setEvaluating(null)} className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 py-2 rounded text-sm font-semibold transition-colors">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">Not evaluated yet.</p>
                    {(user.role === 'Judge' || user.role === 'Administrator') && (
                      <button onClick={() => { setEvaluating(sub._id); setScore(0); setFeedback(''); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors">
                        Evaluate Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JudgeDashboard;
