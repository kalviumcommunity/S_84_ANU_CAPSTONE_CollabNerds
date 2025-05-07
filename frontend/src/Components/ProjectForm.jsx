import React, { useState } from 'react';
import { createProject } from '../api/projectApi';

const ProjectForm = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        title,
        description,
        techStack, // Optional field
      };
      const result = await createProject(projectData);
      console.log('✅ Project Created:', result);
      if (onCreated) onCreated();
    } catch (err) {
      console.error('❌ Project creation failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <label>
        Tech Stack (optional):
        <input value={techStack} onChange={(e) => setTechStack(e.target.value)} />
      </label>
      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectForm;
