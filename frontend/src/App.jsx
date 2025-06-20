// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './Components/FrontPage';
import LoginPage from './Components/LoginPage';
import Navbar from './Components/Navbar';
import MagicCursorTrail from './Components/MagicCursorTrail';
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute'; // Import PrivateRoute
import Dashboard from './Components/Dashboard';
import Teams from './Components/Teams';
import ChatWindow from './Components/ChatWindow';
import ProfilePage from './pages/ProfilePage';
import Projects from "./Components/Projects" ; 
function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* <Router> */}
        <MagicCursorTrail  />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

            <Route
            path="/projects"
            element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            }
          />

          <Route
            path="/teams"
            element={
              <PrivateRoute>
                <Teams />
              </PrivateRoute>
            }
          />
          <Route path ="/profile"
           element={
              <PrivateRoute>
                <ProfilePage/>
              </PrivateRoute>
            }
            />
          <Route
            path="/chat/:partnerId"
            element={
              <PrivateRoute>
                <ChatWindow />
              </PrivateRoute>
            }
          />
        </Routes>
      {/* </Router> */}
    </AuthProvider>
  );
}

export default App;
