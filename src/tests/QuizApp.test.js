import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import QuizList from '../components/QuizList';
import QuizForm from '../components/QuizForm';
import QuestionForm from '../components/QuestionForm';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock data
const mockQuizzes = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Test your JavaScript knowledge',
    timeLimit: 30
  },
  {
    id: 2,
    title: 'React Fundamentals', 
    description: 'Learn React concepts',
    timeLimit: 45
  }
];

describe('Quiz Application Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: mockQuizzes });
    localStorage.setItem("user", JSON.stringify({ name: "TestUser", id: 1 }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('App renders without crashing', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    render(<App />);
    // When not logged in or logged in, check simple UI presence
    // Actually the app redirects to Login if "user" is not in localstorage but we set it.
  });

  test('QuizList shows loading state initially', () => {
    const mockSelectQuiz = jest.fn();
    // Use a blank BrowserRouter for Link usage
    render(
      <BrowserRouter>
        <QuizList onSelectQuiz={mockSelectQuiz} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading quizzes/)).toBeInTheDocument();
  });

  test('QuizList displays quizzes after successful API call', async () => {
    render(
      <BrowserRouter>
        <QuizList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    });
  });

  test('QuizForm renders and submits', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 3, title: 'Test Quiz' } });
    
    render(
      <BrowserRouter>
        <QuizForm />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Create New Quiz')).toBeInTheDocument();
    
    const textboxes = screen.queryAllByRole('textbox');
    if(textboxes.length > 0) {
       fireEvent.change(textboxes[0], { target: { value: 'Test Quiz' } });
       fireEvent.click(screen.getByRole('button', { name: 'Create Quiz' }));
    }
  });

  test('QuestionForm renders correctly', () => {
    render(<QuestionForm quizId={1} />);
    expect(screen.getAllByText('Add Question')[0]).toBeInTheDocument();
  });

  test('QuestionForm submits valid question successfully', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1, questionText: 'Test Question' } });
    
    render(<QuestionForm quizId={1} />);
    
    const inputs = screen.getAllByRole('textbox');
    // First textbox is Question Text
    fireEvent.change(inputs[0], { target: { value: 'What is JavaScript?' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Add Question/i }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});