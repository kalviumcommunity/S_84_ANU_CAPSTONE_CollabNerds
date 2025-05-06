import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Make sure BrowserRouter is correctly imported
import FrontPage from './Components/FrontPage';
import Dashboard from './Components/Dashboard';
import LoginPage from './Components/LoginPage';
import Navbar from './Components/Navbar';
import MagicCursorTrail from './Components/MagicCursorTrail';
import RequireAuth from './Components/RequireAuth';
import { AuthProvider } from './Context/AuthContext';
import PublicProjects from './pages/PublicProjects';

function App() {
  return (
    <AuthProvider>
      {/* Make sure this Router wraps all routes and navigation */}
      <Router>
        <MagicCursorTrail />
        <Navbar /> {/* Navbar will show on all pages */}
        
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes using RequireAuth */}
          <Route path="/explore" element={<PublicProjects />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
