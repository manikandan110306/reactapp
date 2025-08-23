import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/get`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes/add`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const addQuestion = async (quizId, questionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes/${quizId}/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};