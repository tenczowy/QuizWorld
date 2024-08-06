import React, { useEffect, useState } from 'react';
import '../public/NavBar.css';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const [loginStatus, setLoginStatus] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setLoginStatus(JSON.parse(sessionStorage.getItem('loginStatus')) || false);
  }, []);

  function handleLogOut() {
    sessionStorage.setItem('loginStatus', JSON.stringify(false));
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('sessionToken');
    sessionStorage.removeItem('authToken');
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

  return (
    <nav className="primary-nav">
      <div className="logging-btns-container">
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
