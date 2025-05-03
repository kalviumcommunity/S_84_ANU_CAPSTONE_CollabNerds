// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/dashboard/overview">Overview</Link></li>
        <li><Link to="/dashboard/projects">Projects</Link></li>
        <li><Link to="/dashboard/teams">Teams</Link></li>
        <li><Link to="/dashboard/messages">Messages</Link></li>
        <li><Link to="/dashboard/settings">Settings</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
