import React, { useEffect, useState } from 'react';
import '../public/LoginForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterForm({ handleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationStatus) {
      handleRegister(registrationStatus);
    }
  }, [registrationStatus]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage(
        "Password doesn't match with confirmation, check your spelling."
      );
    } else {
      async function sendRegistrationRequest() {
        // Send server request to validate login, then pass result of validation to handleLogin function
        try {
          await axios
            .post('http://localhost:4000/register', {
              params: { username: username, password: password },
            })
            .then(async (res) => {
              setRegistrationStatus(res);
            });
        } catch (err) {
          console.log(err + 'Error sending register request');
        }
      }
      sendRegistrationRequest();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
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
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      </div>
      <div className="form-btns-container">
        <button type="submit" className="login-button">
          Register
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
