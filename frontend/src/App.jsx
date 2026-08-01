import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import GeneralLayout from './layouts/GeneralLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HackathonList from './pages/HackathonList';
import HackathonDetails from './pages/HackathonDetails';
import CreateHackathon from './pages/CreateHackathon';
import SubmitProject from './pages/SubmitProject';
import JudgeDashboard from './pages/JudgeDashboard';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<GeneralLayout />}>
                <Route index element={<Home />} />
                <Route path="hackathons" element={<HackathonList />} />
                <Route path="hackathons/:id" element={<HackathonDetails />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['Participant']} />}>
                  <Route path="submit-project" element={<SubmitProject />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['Organizer', 'Administrator']} />}>
                  <Route path="hackathons/create" element={<CreateHackathon />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['Judge', 'Administrator', 'Organizer']} />}>
                  <Route path="judge-dashboard" element={<JudgeDashboard />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
