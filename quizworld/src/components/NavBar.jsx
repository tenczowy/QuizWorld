import React, { useEffect, useState } from 'react';
import '../public/NavBar.css';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const [loginStatus, setLoginStatus] = useState();
  const [userRole, setUserRole] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setLoginStatus(JSON.parse(sessionStorage.getItem('loginStatus')) || false);
    setUserRole(sessionStorage.getItem('userRole') || false);
  }, []);

  function handleLogOut() {
    sessionStorage.setItem('loginStatus', JSON.stringify(false));
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('sessionToken');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    setLoginStatus(false);
    navigate('/', {
      replace: true,
      state: { loginStatus: false },
      key: Date.now(),
    });
  }

  function navigateHome() {
    navigate('/', {
      replace: true,
      state: { loginStatus: loginStatus },
    });
  }

  function navigateQuestions() {
    navigate('/addQuestion', {
      replace: true,
      state: { loginStatus: loginStatus },
    });
  }

  function navigateAdminPanel() {
    navigate('/adminPanel', {
      replace: true,
      state: { loginStatus: loginStatus },
    });
  }

  return (
    <nav className="primary-nav">
      <div className="logging-btns-container">
        {userRole === 'admin' ? (
          <button className="logout-btn" onClick={navigateAdminPanel}>
            Admin Panel
          </button>
        ) : null}
        <button className="logout-btn" onClick={navigateHome}>
          Home
        </button>
        {loginStatus ? (
          <button className="logout-btn" onClick={navigateQuestions}>
            Add Question
          </button>
        ) : null}
        {!loginStatus ? (
          <Link to="/logIn">Log In</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogOut}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
