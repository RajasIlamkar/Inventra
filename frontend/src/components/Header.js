import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Inventra</Link>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        {isLoggedIn ? (
          <>
            <Link to="/inventory" className="nav-link">Inventory</Link>
            <Link to="/orders" className="nav-link">Orders</Link>
            <Link to="/analysis" className="nav-link">Insights</Link>
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
