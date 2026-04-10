import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import QuizResults from './QuizResults';

jest.mock('axios');

// Mock useParams to return a quizId
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ quizId: '1' }),
}));

describe('QuizResults Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ name: 'TestUser', id: 1, role: 'STUDENT' }));
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders loading state initially', async () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(
      <BrowserRouter>
        <QuizResults />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading your results/i)).toBeInTheDocument();
  });

  it('displays results when API returns attempt data', async () => {
    const mockAttempts = [
      { id: 10, studentName: 'TestUser', score: 8, totalQuestions: 10 }
    ];
    axios.get.mockResolvedValueOnce({ data: mockAttempts });

    render(
      <BrowserRouter>
        <QuizResults />
      </BrowserRouter>
    );

    // 80% -> "Great Job!"
    await waitFor(() => {
      expect(screen.getByText(/Great Job!/i)).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByText(/8 out of 10 correct/i)).toBeInTheDocument();
    });
  });
});

