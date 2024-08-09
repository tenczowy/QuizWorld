import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function PrivateRoute({ element }) {
  const userId = sessionStorage.getItem('userId');
  const authToken = sessionStorage.getItem('authToken');
  const [userRole, setUserRole] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/verifyRole/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserRole(response.data.userRole.role);
        setIsLoading(false);
      } catch (err) {
        console.log('Error getting user role', err);
      }
    };
    fetchUserRole();
  }, [userId, authToken]);

  if (isLoading) return <h1>Loading....</h1>;

  if (userRole === 'admin') {
    return element;
  } else {
    return (
      <>
        {alert('access denied!')}
        <Navigate to="/logIn" replace />;
      </>
    );
  }
}

export default PrivateRoute;
