import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const handleLogout = async () => {
  //  Remove the token from local storage
  localStorage.removeItem('token');

  // Optionally, perform any additional cleanup or redirection
  // For example, redirect the user to the login page
  window.location.href = '/'; // Redirect to the login page
  };

  const token = localStorage.getItem("token"); // Check if token exists

  return (
    <nav>
      <div className="nav-logo-container">
        <h1>SmartCal</h1>
      </div>
      <div className="navbar-links-container">
        <Link to="/">Home</Link>
        {token ? (
          <button className="primary-button" onClick={handleLogout}>Log Out</button>
        ) : (
          <Link to="/login">Log In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
