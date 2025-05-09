import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

function RequireAuth() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This ensures that the component checks localStorage and updates user state
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // You can show a loading spinner or something similar
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Render the nested route components if authenticated
}

export default RequireAuth;
