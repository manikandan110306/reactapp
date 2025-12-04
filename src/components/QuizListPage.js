import React from 'react';
import QuizList from './QuizList';
import { useNavigate } from 'react-router-dom';

const QuizListPage = ({ onSelectQuiz }) => {
  const navigate = useNavigate();

  const handleSelect = (id) => {
    // navigate to take quiz page
    navigate(`/take-quiz/${id}`);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>All Quizzes</h2>
      </div>
      <QuizList onSelectQuiz={handleSelect} />
    </div>
  );
};

export default QuizListPage;
