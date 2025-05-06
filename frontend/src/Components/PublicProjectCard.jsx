import React, { useState } from 'react';
import { requestToJoinProject } from '../api/projectApi';

const PublicProjectCard = ({ project, currentUserId }) => {
  const [requested, setRequested] = useState(false);

  const handleJoinRequest = async () => {
    try {
      await requestToJoinProject(project._id);
      setRequested(true);
      alert('Request sent!');
    } catch (err) {
      console.error(err);
      alert('Error sending request');
    }
  };

  const canRequest =
    project.createdBy !== currentUserId &&
    !project.collaborators.includes(currentUserId) &&
    !project.requests.includes(currentUserId);

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tags">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {canRequest && !requested && (
        <button onClick={handleJoinRequest}>Request to Join</button>
      )}
      {requested && <span className="requested-label">Request Sent</span>}
    </div>
  );
};

export default PublicProjectCard;
