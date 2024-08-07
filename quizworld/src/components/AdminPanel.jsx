import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import '../public/AdminPanel.css';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();

  function navigateManageUsers() {
    navigate('/manageUsers', {
      replace: true,
    });
  }

  function navigateManageQuestions() {
    navigate('/manageQuestions', {
      replace: true,
    });
  }

  return (
    <div className="adminPanelContainer">
      <NavBar />
      <div className="contentContainer">
        <button className="btn" onClick={navigateManageUsers}>
          Manage Users
        </button>
        <button className="btn" onClick={navigateManageQuestions}>
          Manage Questions
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
