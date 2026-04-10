import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  // Check if they are completely logged out or have invalid user object
  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  // Check if this route is restricted to specific roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they have a role but shouldn't be here, send them to their dashboard
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default PrivateRoute;
