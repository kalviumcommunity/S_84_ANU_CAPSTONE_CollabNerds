// src/components/dashboard/MyProjects.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectFormModal from './ProjectFormModal';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    const res = await axios.get('/api/projects/mine', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProjects(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchProjects();
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="projects-section">
      <div className="section-header">
        <h2>My Projects</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>+ Create New Project</button>
      </div>
      <div className="projects-grid">
        {projects.map(p => (
          <div key={p._id} className="project-card">
            <div className="project-header">
              <h3>{p.title}</h3>
              <div>
                <button onClick={() => handleEdit(p)}>✏️</button>
                <button onClick={() => handleDelete(p._id)}>🗑️</button>
              </div>
            </div>
            <p>{p.description}</p>
            <div className="tags">
              {p.tags?.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
};

export default MyProjects;
