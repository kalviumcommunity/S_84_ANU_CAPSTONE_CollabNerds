// Dashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';  // Import Sidebar component
import Navbar from './Navbar';  // Import Navbar component
import '../Styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-content">
          <h2>Welcome to Your Dashboard</h2>
          <p>Here you can manage your projects, teams, and more!</p>

          {/* Add sections as you build more */}
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
