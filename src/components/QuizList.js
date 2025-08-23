import React, { useState, useEffect } from 'react';
import { getQuizzes } from '../utils/api';

const QuizList = ({ onSelectQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError('Failed to fetch quizzes');
        setQuizzes([]); // Clear quizzes on error
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div className="loading-state">Loading quizzes</div>;
if (error) return <div className="error">Failed to fetch quizzes</div>;
if (quizzes.length === 0) return <div className="empty-state">No quizzes available</div>;

  return (
    <div data-testid="quiz-list">
      {quizzes.map(quiz => (
        <div 
          key={quiz.id} 
          onClick={() => onSelectQuiz(quiz.id)}
          data-testid={`quiz-${quiz.id}`}
        >
          <h3>{quiz.title}</h3>
          <p>{quiz.description}</p>
          <p>Time Limit: {quiz.timeLimit} minutes</p>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
