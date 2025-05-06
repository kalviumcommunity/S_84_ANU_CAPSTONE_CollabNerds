import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import PublicProjectCard from '../Components/PublicProjectCard';
import { useAuth } from '../Context/AuthContext';

const PublicProjects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await axios.get('/projects'); // Make sure this route returns all public projects
      setProjects(res.data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="public-projects-container">
      <h2>Explore Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <PublicProjectCard key={project._id} project={project} currentUserId={user?._id} />
        ))}
      </div>
    </div>
  );
};

export default PublicProjects;
