import React, { useState } from 'react';
import axios from 'axios';

const QuizForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/quizzes', {
        title,
        description,
        timeLimit
      });
      setMessage('Quiz created successfully!');
      setTitle('');
      setDescription('');
      setTimeLimit(10);
    } catch (error) {
      setMessage('Failed to create quiz. Please try again.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ color: '#2193b0', marginBottom: '1.5rem', textAlign: 'center' }}>Create New Quiz</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Time Limit (minutes)</label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            min="1"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button 
          type="submit" 
          style={{ 
            background: '#2193b0', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Create Quiz
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default QuizForm;