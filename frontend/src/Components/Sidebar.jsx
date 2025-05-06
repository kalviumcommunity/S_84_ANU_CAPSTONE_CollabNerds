import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaProjectDiagram, 
  FaUsers, 
  FaComments, 
  FaCog 
} from 'react-icons/fa';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li className="active">
          <Link to="/dashboard/overview">
            <FaHome />
            <span>Overview</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/projects">
            <FaProjectDiagram />
            <span>Projects</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/teams">
            <FaUsers />
            <span>Teams</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/messages">
            <FaComments />
            <span>Messages</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/settings">
            <FaCog />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;