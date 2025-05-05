import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './Components/FrontPage';
import Dashboard from './Components/Dashboard'; // Import Dashboard component
// import LoginPage from './Components/LoginPage'; // Import your LoginPage component
import Navbar from './Components/Navbar'; // Import Navbar component
import MagicCursorTrail from './Components/MagicCursorTrail';

function App() {
  return (
    <Router>
      <MagicCursorTrail />
      <Navbar /> {/* Display Navbar on all pages */}
      <Routes>
        <Route path="/" element={<FrontPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
