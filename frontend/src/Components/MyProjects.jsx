import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', techStack: '' });

  const fetchProjects = async () => {
    const res = await axios.get('/api/projects/my-projects', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/projects', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setForm({ title: '', description: '', techStack: '' });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchProjects();
  };

  return (
    <div>
      <h2>Start a New Project</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input type="text" placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <br />
        <textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <br />
        <input type="text" placeholder="Tech Stack" value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })} required />
        <br />
        <button type="submit">Create Project</button>
      </form>

      <h3>My Projects</h3>
      <ul>
        {projects.map(proj => (
          <li key={proj._id}>
            <strong>{proj.title}</strong> - {proj.techStack}
            <p>{proj.description}</p>
            <button onClick={() => handleDelete(proj._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProjects;