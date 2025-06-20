import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Styles/Projects.css";
import { jwtDecode } from 'jwt-decode';

const Projects = () => {
  const API_BASE_URL = 'http://localhost:6767'; // Replace with deployed URL when needed

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStack, setFilterStack] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user ID from JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(res.data);
        setFilteredProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Apply search + filter
  useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStack = filterStack === '' || project.techStack?.toLowerCase().includes(filterStack.toLowerCase());
      return matchesSearch && matchesStack;
    });
    setFilteredProjects(filtered);
  }, [searchTerm, filterStack, projects]);

  const handleJoinRequest = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/projects/${projectId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Join request sent!');
    } catch (err) {
      console.error('Error sending join request:', err);
      alert('❌ Failed to send request');
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-container">
      <h2 className="projects-heading">🚀 Explore Projects</h2>

      <div className="search-filter-box">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="💻 Filter by tech stack..."
          value={filterStack}
          onChange={(e) => setFilterStack(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => {
          const isOwner = project.createdBy?._id === currentUserId;
          const isCollaborator = project.collaborators?.some(member => member._id === currentUserId);
          const hasRequested = project.pendingRequests?.some(user => user._id === currentUserId);

          return (
            <div className="project-card" key={project._id}>
              <h3 className="project-title">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <p><strong>🎯 Goals:</strong> {project.goals || 'Not specified'}</p>
              <p><strong>💻 Tech Stack:</strong> {project.techStack}</p>
              <p><strong>🧑 Owner:</strong> {project.createdBy?.name || 'Unknown'}</p>
              <p><strong>🤝 Team:</strong> {
                project.collaborators?.length
                  ? project.collaborators.map((member, idx) => (
                      <span key={member._id}>{member.name}{idx < project.collaborators.length - 1 ? ', ' : ''}</span>
                    ))
                  : 'No members yet'
              }</p>

              <div className="project-action">
                {isOwner ? (
                  <span className="owner-badge">🎓 You are the Owner</span>
                ) : isCollaborator ? (
                  <span className="collab-badge">✅ You are a Collaborator</span>
                ) : hasRequested ? (
                  <span className="requested-badge">📨 Request Sent</span>
                ) : (
                  <button onClick={() => handleJoinRequest(project._id)} className="join-btn">🤝 Request to Join</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
    