import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FrontPage from './Components/FrontPage';
import LoginPage from './Components/LoginPage';
import Navbar from './Components/Navbar';
import MagicCursorTrail from './Components/MagicCursorTrail';
import RequireAuth from './Components/RequireAuth';
import { AuthProvider } from './Context/AuthContext';
import Dashboard from './Components/Dashboard';
// Temporarily comment or remove these until you recreate them
// import Dashboard from './Components/Dashboard';
// import PublicProjects from './Components/PublicProjects';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MagicCursorTrail />
        <Navbar />

        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Uncomment after you recreate PublicProjects */}
          {/* <Route path="/explore" element={<PublicProjects />} /> */}

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
