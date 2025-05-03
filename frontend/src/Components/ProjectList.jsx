import React from "react";
import ProjectCard from "../Components/ProjectCard";

const ProjectList = () => {
  // Imagine this data comes from an API
  const projects = [
    { id: 1, title: "Project 1" },
    { id: 2, title: "Project 2" },
    { id: 3, title: "Project 3" },
  ];

  return (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
