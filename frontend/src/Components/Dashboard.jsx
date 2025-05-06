import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../Styles/Dashboard.css';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h2>Welcome to Your Dashboard</h2>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <p>Here you can manage your projects, teams, and more!</p>

          <section className="section">
            <h3>Overview</h3>
            <p>This section gives you a quick view of your active projects and teams.</p>
          </section>

          <section className="section">
            <h3>Your Projects</h3>
            <p>Manage and collaborate on your ongoing projects.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
