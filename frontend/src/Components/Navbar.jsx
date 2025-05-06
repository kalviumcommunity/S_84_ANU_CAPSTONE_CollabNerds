// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
          <div className="logo-spinner"></div>
          <h1>CollabNerds</h1></div>
          <div className="navbar-nav">
          <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#">Projects</a></li>
              <li><a href="#">Teams</a></li>
              <li><a href="dashboard">Dashboard</a></li>
              <li><a href="#">Profile</a></li>
          </ul>
      </div>
    </nav>
  );
};

export default Navbar;
