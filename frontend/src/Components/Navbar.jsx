// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>CollabNerds</h1>
      </div>
      <nav className="navbar-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/login">Logout</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
