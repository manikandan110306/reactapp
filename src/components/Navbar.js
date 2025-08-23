import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.5rem',
    background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
    padding: '1rem 0',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    color: '#fff',
    fontWeight: 500,
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px',
    transition: 'background 0.2s',
  };

  const activeLinkStyle = {
    ...linkStyle,
    background: '#2193b0'
  };

  return (
    <nav className="navbar-top" style={navStyle}>
      <Link 
        to="/home" 
        style={location.pathname === '/home' ? activeLinkStyle : linkStyle}
      >
        Home
      </Link>
      <Link 
        to="/create-quiz" 
        style={location.pathname === '/create' ? activeLinkStyle : linkStyle}
      >
        Create Quiz
      </Link>
      <Link 
        to="/add-question" 
        style={location.pathname === '/add' ? activeLinkStyle : linkStyle}
      >
        Add Question
      </Link>
      <Link 
        to="/take-quiz" 
        style={location.pathname === '/take' ? activeLinkStyle : linkStyle}
      >
        Take Quiz
      </Link>
      <Link 
        to="/" 
        style={location.pathname === '/' ? activeLinkStyle : linkStyle}
      >
        Logout
      </Link>
    </nav>
  );
};

export default Navbar;