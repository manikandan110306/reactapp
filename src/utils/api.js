import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getQuizzes = async (params = undefined) => {
  try {
    // If no params provided, return the simple list endpoint (array) for backward compatibility
    if (!params || Object.keys(params).length === 0) {
      const response = await axios.get(`${API_BASE_URL}/quizzes/get`);
      return response.data; // array of quizzes
    }

    // If pagination params provided, call pageable endpoint and return the Page object
    const { page = 0, size = 10, sort = 'createdAt,desc' } = params;
    const response = await axios.get(`${API_BASE_URL}/quizzes`, {
      params: { page, size, sort },
    });
    return response.data; // Page object
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    if (!params || Object.keys(params).length === 0) {
      return [];
    }
    return { content: [], totalElements: 0, totalPages: 0, number: 0, size: params?.size || 10 };
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

export const deleteQuiz = async (quizId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/quizzes/${quizId}`);
    return response.status === 204;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};