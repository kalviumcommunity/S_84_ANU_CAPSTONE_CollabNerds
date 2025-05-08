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
    <div>
      <h2>{editingId ? 'Edit Project' : 'Start a New Project'}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Tech Stack"
          value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })}
          required
        />
        <br />
        <button type="submit">{editingId ? 'Update Project' : 'Create Project'}</button>
      </form>

      <h3>My Projects</h3>
      <ul>
        {projects.map((proj) => (
          <li key={proj._id}>
            <strong>{proj.name}</strong> - {proj.techStack}
            <p>{proj.description}</p>
            <button onClick={() => handleEdit(proj)}>Edit</button>
            <button onClick={() => handleDelete(proj._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProjects;
