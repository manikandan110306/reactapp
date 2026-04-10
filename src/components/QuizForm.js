import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizForm = ({ onQuizCreated }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([
    { title: '', description: '', timeLimit: 10 }
  ]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[index][field] = value;
    setQuizzes(updatedQuizzes);
  };

  const addQuizForm = () => {
    setQuizzes([...quizzes, { title: '', description: '', timeLimit: 10 }]);
  };

  const removeQuizForm = (index) => {
    if (quizzes.length === 1) return;
    const updatedQuizzes = quizzes.filter((_, i) => i !== index);
    setQuizzes(updatedQuizzes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (quizzes.length === 1) {
        // Fallback or just regular endpoint for 1
        await axios.post('http://localhost:8080/api/quizzes', quizzes[0]);
      } else {
        // Use the new bulk endpoint
        await axios.post('http://localhost:8080/api/quizzes/bulk', quizzes);
      }
      setMessage({ text: 'Quiz created successfully!', type: 'success' });
      setQuizzes([{ title: '', description: '', timeLimit: 10 }]);
      if (onQuizCreated) onQuizCreated();
      setTimeout(() => navigate("/quizzes"), 1500);
    } catch (error) {
      setMessage({ text: 'Failed to create quiz. Please try again.', type: 'error' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Create New Quiz</h2>
      
      {message.text && (
        <div className={`message ${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {quizzes.map((quiz, index) => (
          <div key={index} className="bulk-quiz-box" style={{ padding: '1rem', border: '3px solid #000', borderRadius: '12px', background: '#fff', position: 'relative' }}>
            {quizzes.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeQuizForm(index)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4d', color: '#fff', border: '2px solid #000', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                X
              </button>
            )}
            <h4 style={{ margin: '0 0 1rem 0' }}>Quiz #{index + 1}</h4>
            <div className="form-row">
              <label>Quiz Title</label>
              <input
                type="text"
                placeholder="Enter a catchy title!"
                value={quiz.title}
                onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea
                placeholder="What is this quiz about?"
                value={quiz.description}
                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                className="form-input"
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="form-row">
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                value={quiz.timeLimit}
                onChange={(e) => handleInputChange(index, 'timeLimit', e.target.value)}
                min="1"
                className="form-input"
                required
              />
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            type="button" 
            className="btn" 
            style={{ background: '#ffd900', color: '#000' }} 
            onClick={addQuizForm}
          >
            + Add Another Quiz
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;