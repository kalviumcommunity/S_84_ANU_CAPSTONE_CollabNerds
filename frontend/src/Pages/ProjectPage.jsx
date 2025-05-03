import React from "react";
import { useParams } from "react-router-dom";

const ProjectPage = () => {
  const { id } = useParams();

  return (
    <div className="project-page">
      <h1 className="project-title">Project Details</h1>
      <p className="project-id">Project ID: <strong>{id}</strong></p>
      {/* You can fetch and display more details based on this ID */}
    </div>
  );
};

export default ProjectPage;
