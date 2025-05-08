import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', techStack: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects/my-projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
      fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProjects();
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

  return (
    <div style={{ background: 'linear-gradient(45deg, #6a11cb, #2575fc)', borderRadius: '20px', padding: '2rem', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)', animation: 'fadeInUp 0.5s ease-out' }}>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1.5rem', fontSize: '2.5rem', background: 'linear-gradient(90deg, #f3a683, #f7d07e)', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'fadeInDown 0.6s ease-out' }}>
        {editingId ? 'Edit Project' : 'Start a New Project'}
      </h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.5rem', backdropFilter: 'blur(5px)' }}>
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
        <button
          type="submit"
          style={buttonStyle}
        >
          {editingId ? 'Update Project' : 'Create Project'}
        </button>
      </form>

      <h3 style={{ color: '#fff', fontSize: '2rem', textAlign: 'center', marginBottom: '1rem', background: 'linear-gradient(90deg, #e0c3fc, #8ec5fc)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
        My Projects
      </h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {projects.map((proj) => (
          <li key={proj._id} style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
            <div style={cardStyle}>
              <strong>{proj.name}</strong> - {proj.techStack}
              <p>{proj.description}</p>
              <button
                onClick={() => handleEdit(proj)}
                style={{ ...buttonStyle, background: '#ff6347', marginRight: '1rem' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(proj._id)}
                style={{ ...buttonStyle, background: '#ff4c4c' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.8rem',
  margin: '0.8rem 0',
  borderRadius: '10px',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.15)',
  color: '#fff',
  fontSize: '1rem',
  backdropFilter: 'blur(6px)',
  transition: 'transform 0.3s ease',
};

const buttonStyle = {
  background: 'linear-gradient(90deg, #a18cd1, #fbc2eb)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.6rem 1.2rem',
  fontWeight: 'bold',
  color: '#1e1e2f',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  margin: '0.5rem 0.2rem',
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '1.5rem',
  borderRadius: '15px',
  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(5px)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};

export default MyProjects;
