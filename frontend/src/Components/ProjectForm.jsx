import React, { useState } from 'react';
import { createProject } from '../api/projectApi';

const ProjectForm = ({ onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', tags: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject({ ...form, tags: form.tags.split(',') });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectForm;