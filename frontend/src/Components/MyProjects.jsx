import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api/axiosInstance';
import "../Styles/MyProject.css"
const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', techStack: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects with useCallback to memoize the function
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects/my-projects');
      
      if (response.data.length > 0) {
          response.data[0].pendingRequests;
      }
      
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleReject = async (projectId, userId) => {
  try {
    const response = await axios.post(`/api/projects/${projectId}/reject`, { userId }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const updated = response.data.project;
    setProjects((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );

  } catch (err) {
    console.error("Error rejecting user:", err.message);
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('/api/projects', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setForm({ name: '', description: '', techStack: '' });
      setEditingId(null);
      fetchProjects(); // Refresh projects after update
    } catch (err) {
      console.error("Error saving project:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProjects(); // Refresh projects after delete
    } catch (err) {
      console.error("Error deleting project:", err.message);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      description: project.description,
      techStack: project.techStack
    });
    setEditingId(project._id);
  };

  const handleAccept = async (projectId, userId) => {
    try {
      await axios.post(`/api/projects/${projectId}/accept`, { userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('User accepted!');
      fetchProjects(); // Refresh projects after accepting
    } catch (err) {
      console.error("Error accepting user:", err.message);
    }
  };

  // Render pending requests safely
const renderPendingRequests = (project) => {
  return project.pendingRequests.map((userObj) => {
    const isObject = typeof userObj === 'object' && userObj !== null;

    const id = isObject ? userObj._id : userObj;
    const name = isObject ? userObj.name : 'Unknown';
    const email = isObject ? userObj.email : 'No email';

   return (
  <div key={id} className="request-item">
    <span className="request-user">{name} ({email})</span>
    <button onClick={() => handleAccept(project._id, id)} className="accept-btn">
      ✅ Accept
    </button>
    <button onClick={() => handleReject(project._id, id)} className="reject-btn">
      ❌ Reject
    </button>
  </div>
);
  });
};


  if (loading) return <div style={loadingStyle}>Loading projects...</div>;
  if (error) return <div style={errorStyle}>Error: {error}</div>;

  return (
    <div style={containerStyle}>
      <div style={animatedBg}></div>
      <h2 style={headingStyle}>
        {editingId ? 'Edit Project' : `Let's Build Something...`}
      </h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          style={{ ...inputStyle, height: '120px' }}
        />
        <input
          type="text"
          placeholder="Tech Stack"
          value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          {editingId ? 'Update Project ✏️🧩' : 'Create Project ✨🧠'}
        </button>
      </form>

      <h3 style={sectionHeadingStyle}>My Projects - My Work ! ...</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {projects.map((proj) => (
          <li key={proj._id} style={{ marginBottom: '1.5rem' }}>
            <div style={projectCardStyle}>
              <h4 style={projectTitle}>
                Title : {proj.name} <span style={techStyle}><br/> Tech Stack : {proj.techStack}</span>
              </h4>
              <p style={projectDescription}>Description : {proj.description}</p>
              <div className="btn-group">
                <button onClick={() => handleEdit(proj)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(proj._id)} className="delete-btn">Delete</button>
              </div>
              
              {proj.pendingRequests && proj.pendingRequests.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ color: ' white' }}>Pending Requests:</strong>
                  {renderPendingRequests(proj)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Styles
const containerStyle = {
  background: 'linear-gradient(45deg, rgba(26, 11, 46, 0.2) 0%, rgba(45, 25, 86, 0.2) 50%, rgba(74, 43, 124, 0.2) 100%)',
  borderRadius: '20px',
  padding: '2rem',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(25px)',
  border: '1px solid rgba(224, 170, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
};

const animatedBg = {
  position: 'absolute',
  top: '-50%',
  left: '-50%',
  width: '200%',
  height: '200%',
  background: 'radial-gradient(circle, rgba(169, 166, 181, 0.05) 20%, transparent 60%)',
  transform: 'rotate(30deg)',
  animation: 'float 20s linear infinite',
  zIndex: 0,
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
  fontSize: '2.8rem',
  WebkitBackgroundClip: 'text',
  textShadow: '0 0 20px rgba(192, 125, 255, 0.3)',
  animation: 'textGlow 2s ease-in-out infinite alternate',
  zIndex: 1,
  position: 'relative',
};

const sectionHeadingStyle = {
  fontSize: '2.2rem',
  textAlign: 'center',
  margin: '2rem 0',
  WebkitBackgroundClip: 'text',
  textShadow: '0 4px 15px rgba(54, 52, 55, 0.3)',
};

const formStyle = {
  marginBottom: '3rem',
  background: 'hsl(0, 0.00%, 100.00%)',
  borderRadius: '16px',
  padding: '2rem',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(103, 103, 107, 0.1)',
  boxShadow: '0 8px 32px rgba(58, 57, 59, 0.1)',
};

const inputStyle = {
  width: '100%',
  padding: '1rem',
  margin: '1rem 0',
  borderRadius: '12px',
  border: '1px solid rgba(15, 14, 16, 0.2)',
  background: 'rgba(10, 11, 12, 0.3)',
  color: '#f3f4f6',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
};

const buttonStyle = {
  background: 'linear-gradient(135deg, rgba(120, 120, 128, 0.4) 0%, rgba(12, 10, 13, 0.4) 100%)',
  border: '1px solid rgba(118, 114, 120, 0.3)',
  borderRadius: '12px',
  padding: '0.8rem 2rem',
  fontWeight: '600',
  color: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(5px)',
};

const projectCardStyle = {
  background: 'linear-gradient(145deg, rgba(207, 205, 210, 0.3), rgba(3, 3, 27, 0.4))',
  borderRadius: '16px',
  padding: '1.5rem 2rem',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(107, 104, 108, 0.1)',
  boxShadow: '0 4px 12px rgba(174, 173, 175, 0.1)',
};

const projectTitle = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '1.4rem',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const techStyle = {
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.95rem',
};

const projectDescription = {
  color: 'rgba(255, 255, 255, 0.85)',
  lineHeight: '1.6',
};

const loadingStyle = {
  textAlign: 'center',
  padding: '2rem',
  fontSize: '1.2rem',
  color: '#f3f4f6'
};

const errorStyle = {
  textAlign: 'center',
  padding: '2rem',
  fontSize: '1.2rem',
  color: '#ff6b6b'
};

export default MyProjects;