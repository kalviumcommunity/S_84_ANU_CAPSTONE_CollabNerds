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
      setProjects(Array.isArray(res.data) ? res.data : []); // Ensure data is an array
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setProjects([]); // Fallback to empty array
    }
  };

  const fetchContributions = async () => {
    try {
      const res = await getMyContributions();
      setContributions(Array.isArray(res.data) ? res.data : []); // Ensure data is an array
    } catch (err) {
      console.error("Failed to fetch contributions:", err);
      setContributions([]); // Fallback to empty array
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await getUpcomingMeetings();
      setMeetings(Array.isArray(res.data) ? res.data : []); // Ensure data is an array
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
      setMeetings([]); // Fallback to empty array
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
              {showProjectForm ? 'Cancel' : '+ Create New Project'}
            </button>
          </div>

          {showProjectForm && (
            <ProjectForm onCreated={() => {
              setShowProjectForm(false);
              fetchProjects();
            }} />
          )}

          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tags">
                    {Array.isArray(project.tags) && project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="project-footer">
                    <button onClick={() => handleDelete(project._id)}>Delete</button>
                    {/* Add Edit functionality here if needed */}
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
              ))
            ) : (
              <p>No projects yet. Start by creating one!</p>
            )}
          </div>
        </section>

        <section className="contributions-section">
          <h2>My Contributions</h2>
          <div className="projects-grid">
            {contributions.length > 0 ? (
              contributions.map((project) => (
                <div key={project._id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              ))
            ) : (
              <p>You are not contributing to any projects yet.</p>
            )}
          </div>
        </section>

        <section className="meetings-section">
          <div className="section-header">
            <h2>Upcoming Meetings</h2>
            <button className="primary-btn" onClick={() => setShowMeetingForm(!showMeetingForm)}>
              {showMeetingForm ? 'Cancel' : '+ Schedule New Meeting'}
            </button>
          </div>

          {showMeetingForm && (
            <MeetingForm onCreated={(newMeeting) => {
              setMeetings((prev) => [...prev, newMeeting]);
              setShowMeetingForm(false);
            }} />
          )}

          <div className="meetings-grid">
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <div key={meeting._id} className="meeting-card">
                  <h3>{meeting.title}</h3>
                  <p>{meeting.description}</p>
                  <span>
                    Scheduled For:{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(meeting.scheduledFor))}
                  </span>
                </div>
              ))
            ) : (
              <p>No upcoming meetings.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
