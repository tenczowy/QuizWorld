import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useNavigate } from 'react-router-dom';

function LoginPage({ loggedIn }) {
  sessionStorage.clear();
  const [loginRegisterToggle, setLoginRegisterToggle] = useState(true);
  const [registerResult, setRegisterResult] = useState();
  const [loginStatus, setLoginStatus] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (registerResult) {
      if (registerResult.data.status) {
        alert(registerResult.data.result);
        setRegisterResult(null);
        toggleView();
      } else {
        alert(registerResult.data.result);
      }
    }
  }, [registerResult]);

  useEffect(() => {
    if (loginStatus) {
      if (loginStatus.data.status) {
        sessionStorage.setItem('loginStatus', loginStatus.data.status);
        sessionStorage.setItem('userId', loginStatus.data.userId);
        sessionStorage.setItem('authToken', loginStatus.data.authToken);
        sessionStorage.setItem('userRole', loginStatus.data.userRole);

        navigate('/', {
          replace: true,
          state: { loginStatus: loginStatus.data.status },
        });
      } else {
        setErrorMessage(loginStatus.data.result);
      }
    }
  }, [loginStatus]);

  function toggleView() {
    setLoginRegisterToggle(!loginRegisterToggle);
  }

  function handleLogin(loginResult) {
    setLoginStatus(loginResult);
  }

  async function handleRegister(result) {
    //registerResult will store value if registration was successfull
    //if true will rerender on login page with message that registration was successfull
    //if false will prompt
    setRegisterResult(result);
  }

  if (loginRegisterToggle) {
    return (
      <div className="container">
        <NavBar loggedIn={loggedIn} />
        <h1>Log In</h1>
        <LoginForm handleLogin={handleLogin} errorMessage={errorMessage} />
        <button className="loginRegisterToggle" onClick={toggleView}>
          Don't have account yet? Register
        </button>
      </div>
    );
  } else {
    return (
      <div className="container">
        <NavBar loggedIn={loggedIn} />
        <h1>Register</h1>
        <RegisterForm handleRegister={handleRegister} />
        <button className="loginRegisterToggle" onClick={toggleView}>
          Already have account? Log in
        </button>
      </div>
    );
  }
}

export default LoginPage;
