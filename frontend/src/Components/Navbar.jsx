// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  return (
    <nav class="navbar">
      <div class="navbar-brand">
          <div class="logo-spinner"></div>
          <h1>CollabNerds</h1></div>
          <div class="navbar-nav">
          <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Projects</a></li>
              <li><a href="#">Teams</a></li>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Profile</a></li>
          </ul>
      </div>
    </nav>
  );
};

export default Navbar;
