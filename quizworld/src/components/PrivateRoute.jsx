import React from 'react';
import { Navigate } from 'react-router-dom';

//TODO verifie user role on server side and then perform validation

function PrivateRoute({ element }) {
  const loginStatus =
    JSON.parse(sessionStorage.getItem('loginStatus')) || false;

  if (loginStatus) {
    return element;
  } else {
    return <Navigate to="/logIn" replace />;
  }
}

export default PrivateRoute;
