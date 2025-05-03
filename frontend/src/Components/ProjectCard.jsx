import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <Link to={`/project/${project.id}`}>View Project</Link>
    </div>
  );
};

export default ProjectCard;
