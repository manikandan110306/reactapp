import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getLinkClass = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <nav className="navbar-top">
      {user && (
        <>
          <Link to="/home" className={getLinkClass('/home')}>Home</Link>
          <Link to="/create-quiz" className={getLinkClass('/create-quiz')}>Create Quiz</Link>
          <Link to="/add-question" className={getLinkClass('/add-question')}>Add Question</Link>
          <Link to="/quizzes" className={getLinkClass('/quizzes')}>All Quizzes</Link>
          <button onClick={handleLogout} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '1rem', marginLeft: 'auto' }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;