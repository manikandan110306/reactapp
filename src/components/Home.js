import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };
  return (
    <div className="gradient-bg">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'var(--secondary-color)', border: 'var(--border-thick)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', color: '#111' }}>Welcome to QuizMaster!</h1>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-color)' }}>Hey there, {user.name} 👋</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111', lineHeight: '1.6' }}>
          Create and manage quizzes, add questions, and track results with our totally revamped, ultra-fun platform.
        </p>
      </div>
    </div>
  );
};

export default Home;