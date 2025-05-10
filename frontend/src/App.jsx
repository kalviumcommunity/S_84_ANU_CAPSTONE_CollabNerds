import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './Components/FrontPage';
import LoginPage from './Components/LoginPage';
import Navbar from './Components/Navbar';
import MagicCursorTrail from './Components/MagicCursorTrail';
import RequireAuth from './Components/RequireAuth';
import { AuthProvider } from './Context/AuthContext';
import Dashboard from './Components/Dashboard';
import Teams from './Components/Teams';
import ChatWindow from './Components/ChatWindow'; // Import ChatWindow component
import UserList from './Components/UserList'; // Import UserList component for navigation

function App() {
  return (
    <AuthProvider>
      <Router>
        <MagicCursorTrail />
        <Navbar />
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} /> {/* Route for Teams */}
            <Route path="/chat/:partnerId" element={<ChatWindow />} /> {/* Route for ChatWindow */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
