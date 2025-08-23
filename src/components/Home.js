import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.name);
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ color: '#2193b0', marginBottom: '1rem' }}>Welcome to QuizMaster</h2>
      <h3>Welcome, {user.name}</h3>
      <p style={{ color: '#555', lineHeight: '1.6' }}>
        
        Create and manage quizzes, add questions, and track results with our easy-to-use quiz management system.
      </p>
    </div>
  );
};

export default Home;