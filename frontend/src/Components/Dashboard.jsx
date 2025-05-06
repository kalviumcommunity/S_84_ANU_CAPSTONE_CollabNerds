// Dashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import '../Styles/Dashboard.css';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { title: 'My Projects', value: 2, description: 'Projects you\'ve created' },
    { title: 'My Contributions', value: 3, description: 'Projects you\'re contributing to' },
    { title: 'Upcoming Meetings', value: 2, description: 'Scheduled in next 7 days' }
  ];

  const projects = [
    {
      title: "AI-Powered Study Assistant",
      description: "Building an AI assistant to help students organize study materials.",
      tags: ["React", "Node.js", "ML"],
      members: 24,
      updated: "2d ago"
    },
    {
      title: "Campus Event Finder", 
      description: "Mobile app for campus events discovery.",
      tags: ["React Native", "Firebase"],
      members: 18,
      updated: "5d ago"
    }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, <span>{user?.name || 'User'}</span> 👋</h1>
            <p>Ready to build something amazing today?</p>
          </div>
          <button onClick={() => logout()}>Logout</button>
        </header>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>

        <section className="projects-section">
          <div className="section-header">
            <h2>My Projects</h2>
            <button className="primary-btn">+ Create New Project</button>
          </div>
          
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span>{project.members} members</span>
                </div>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-footer">
                  <span>Updated {project.updated}</span>
                  <button>Manage</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;