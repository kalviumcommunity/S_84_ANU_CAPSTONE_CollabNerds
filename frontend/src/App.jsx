import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './Components/FrontPage';
import Dashboard from './Components/Dashboard';
import LoginPage from './Components/LoginPage';
import Navbar from './Components/Navbar';
import MagicCursorTrail from './Components/MagicCursorTrail';
import RequireAuth from './Components/RequireAuth';
import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MagicCursorTrail />
        <Navbar /> {/* Keep if you want Navbar on all pages */}

        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Add more protected/public routes here as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
