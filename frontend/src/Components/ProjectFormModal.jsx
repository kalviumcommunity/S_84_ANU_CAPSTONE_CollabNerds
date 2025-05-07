// src/components/dashboard/ProjectFormModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectFormModal = ({ project, onClose }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [tags, setTags] = useState(project?.tags?.join(', ') || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, tags: tags.split(',').map(t => t.trim()) };
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

    if (project) {
      await axios.delete(`/api/projects/${project._id}`, config); // Optional: remove old
      await axios.post('/api/projects', payload, config);
    } else {
      await axios.post('/api/projects', payload, config);
    }
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h3>{project ? 'Edit Project' : 'Create New Project'}</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
        <button type="submit">Save</button>
        <button onClick={onClose} type="button">Cancel</button>
      </form>
    </div>
  );
};

export default ProjectFormModal;
