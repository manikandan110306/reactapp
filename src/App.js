import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import QuizForm from './components/QuizForm';
import QuestionForm from './components/QuestionForm';
import TakeQuiz from './components/TakeQuiz';
import QuizResults from './components/QuizResults';
import AttendQuiz from './components/AttendQuiz';
import PrivateRoute from './components/PrivateRoute';
import QuizListPage from './components/QuizListPage';
import { getQuizzes } from './utils/api';
import Login from './components/Login';
import Signup from './components/Signup';


function App() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    }
    fetchQuizzes();
  }, []);

  return (
    <Router>
      <AppContent quizzes={quizzes} />
    </Router>
  );
}

function AppContent({ quizzes }) {
  const location = useLocation();

  // hide Navbar on login & signup
  const hideNavbar = ["/", "/signup"].includes(location.pathname);

  return (
    <div className="gradient-bg">
      <div className="page-card">
        {/* ✅ Navbar only visible after login */}
        {!hideNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/create-quiz" element={<PrivateRoute><QuizForm /></PrivateRoute>} />
          <Route path="/add-question" element={<PrivateRoute><QuestionForm quizzes={quizzes} /></PrivateRoute>} />
          <Route path="/take-quiz" element={<PrivateRoute><TakeQuiz quizzes={quizzes} /></PrivateRoute>} />
          <Route path="/take-quiz/:quizId" element={<PrivateRoute><AttendQuiz /></PrivateRoute>} />
          <Route path="/results/:quizId" element={<PrivateRoute><QuizResults /></PrivateRoute>} />
          <Route path="/quizzes" element={<PrivateRoute><QuizListPage /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
