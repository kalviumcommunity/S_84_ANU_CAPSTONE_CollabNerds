import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../Styles/Dashboard.css';
import { useAuth } from '../Context/AuthContext';
import { getMyProjects, deleteProject, acceptRequest, getMyContributions } from '../api/projectApi';
import { getUpcomingMeetings } from '../api/meetingApi';
import ProjectForm from '../Components/ProjectForm';
import MeetingForm from '../Components/MeetingForm';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await getMyProjects();
      console.log("Fetched projects:", res.data);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]);
    }
  };

  const fetchContributions = async () => {
    try {
      const res = await getMyContributions();
      console.log("Fetched contributions:", res.data);
      setContributions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch contributions:", err);
      setContributions([]);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await getUpcomingMeetings();
      console.log("Fetched meetings:", res.data);
      setMeetings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
      setMeetings([]);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchContributions();
    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleAcceptRequest = async (projectId, userId) => {
    try {
      await acceptRequest(projectId, userId);
      fetchProjects();
    } catch (err) {
      console.error("Failed to accept join request:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, <span>{user?.name || 'User'}</span> 👋</h1>
            <p>Ready to build something amazing today?</p>
          </div>
          <button onClick={logout}>Logout</button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>My Projects</h3>
            <div className="stat-value">{projects.length}</div>
            <p>Projects you've created</p>
          </div>
          <div className="stat-card">
            <h3>My Contributions</h3>
            <div className="stat-value">{contributions.length}</div>
            <p>Projects you're contributing to</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Meetings</h3>
            <div className="stat-value">{meetings.length}</div>
            <p>Scheduled in next 7 days</p>
          </div>
        </div>

        <section className="projects-section">
          <div className="section-header">
            <h2>My Projects</h2>
            <button className="primary-btn" onClick={() => setShowProjectForm(!showProjectForm)}>
              + Create New Project
            </button>
          </div>

          {showProjectForm && (
            <ProjectForm onCreated={() => {
              setShowProjectForm(false);
              fetchProjects();
            }} />
          )}

          <div className="projects-grid">
            {Array.isArray(projects) && projects.map((project) => (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-footer">
                  <button onClick={() => handleDelete(project._id)}>Delete</button>
                </div>
                {project.requests?.length > 0 && (
                  <div className="requests">
                    <h4>Join Requests:</h4>
                    {project.requests.map((requestUserId) => (
                      <div key={requestUserId} className="request-item">
                        <span>User ID: {requestUserId}</span>
                        <button onClick={() => handleAcceptRequest(project._id, requestUserId)}>Accept</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="contributions-section">
          <h2>My Contributions</h2>
          <div className="projects-grid">
            {Array.isArray(contributions) && contributions.map((project) => (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="meetings-section">
          <div className="section-header">
            <h2>Upcoming Meetings</h2>
            <button className="primary-btn" onClick={() => setShowMeetingForm(!showMeetingForm)}>
              + Schedule New Meeting
            </button>
          </div>

          {showMeetingForm && (
            <MeetingForm onCreated={() => {
              setShowMeetingForm(false);
              fetchMeetings();
            }} />
          )}

          <div className="meetings-grid">
            {Array.isArray(meetings) && meetings.map((meeting) => (
              <div key={meeting._id} className="meeting-card">
                <h3>{meeting.title}</h3>
                <p>{meeting.description}</p>
                <span>Scheduled For: {new Date(meeting.scheduledFor).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
