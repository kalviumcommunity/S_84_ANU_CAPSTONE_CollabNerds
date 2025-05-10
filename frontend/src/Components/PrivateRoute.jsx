// src/Components/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null to handle loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optionally show a loading spinner
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null; // Prevent rendering children while redirecting
  }

  return children;
};

export default PrivateRoute;
