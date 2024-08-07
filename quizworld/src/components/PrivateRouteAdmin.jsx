import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element }) {
  const userRole = sessionStorage.getItem('userRole') || false;

  if (userRole === 'admin') {
    return element;
  } else {
    alert('Access Denied!');
    return <Navigate to="/logIn" replace />;
  }
}

export default PrivateRoute;
