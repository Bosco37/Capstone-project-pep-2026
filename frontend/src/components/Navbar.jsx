import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-md transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-blue-400">✧</span> LuminaHack
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link to="/hackathons" className="hover:text-gray-300 transition-colors">Hackathons</Link>
          <Link to="/leaderboard" className="hover:text-gray-300 font-semibold text-yellow-400 transition-colors">Leaderboard</Link>
          {user && (user.role === 'Organizer' || user.role === 'Administrator') && (
            <Link to="/hackathons/create" className="hover:text-gray-300 transition-colors">Create</Link>
          )}
          {user && (user.role === 'Judge' || user.role === 'Administrator' || user.role === 'Organizer') && (
            <Link to="/judge-dashboard" className="hover:text-gray-300 transition-colors">Review</Link>
          )}
          
          <div className="h-6 w-px bg-gray-600 mx-2"></div>
          
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-gray-300 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded py-1 px-3 ml-2 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
