import React, { useState } from 'react';
import '../public/LoginForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm({ handleLogin, errorMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    async function sendLoginRequest() {
      try {
        await axios
          .post('http://localhost:4000/login', {
            params: { username: username, password: password },
          })
          .then(async (res) => {
            handleLogin(res);
          });
      } catch (err) {
        console.log(err + 'Error sending register request');
      }
    }
    sendLoginRequest();
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-btns-container">
        <button type="submit" className="login-button">
          Log In
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
