import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { BiLogOut } from 'react-icons/bi';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Binge.</h1>
      <div className="nav-right">
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/watched">Watched</Link>
          {!token && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
        {token && (
          <button className="logout-icon" onClick={handleLogout} title="Logout">
            <BiLogOut />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
