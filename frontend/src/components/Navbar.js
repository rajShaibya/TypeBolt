import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/test" className="navbar-brand">
          TypeBolt
        </Link>
        <div className="navbar-menu">
          <Link to="/test" className="navbar-link">
            Typing Test
          </Link>
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
        </div>
        <div className="navbar-user">
          <span className="username">Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 