// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo-spinner"></div>
        <h1>CollabNerds</h1>
      </div>
      <div className="navbar-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/teams">Teams</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
