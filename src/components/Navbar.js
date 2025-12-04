import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar-top" style={navStyle}>
      {user && (
        <>
          <Link to="/home" style={location.pathname === '/home' ? activeLinkStyle : linkStyle}>Home</Link>
          <Link to="/create-quiz" style={location.pathname === '/create-quiz' ? activeLinkStyle : linkStyle}>Create Quiz</Link>
          <Link to="/add-question" style={location.pathname === '/add-question' ? activeLinkStyle : linkStyle}>Add Question</Link>
          <Link to="/take-quiz" style={location.pathname === '/take-quiz' ? activeLinkStyle : linkStyle}>Take Quiz</Link>
          <Link to="/quizzes" style={location.pathname === '/quizzes' ? activeLinkStyle : linkStyle}>All Quizzes</Link>
          <button onClick={handleLogout} style={{ ...linkStyle, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;