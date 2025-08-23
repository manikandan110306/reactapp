import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import QuizForm from './components/QuizForm';
import QuestionForm from './components/QuestionForm';
import TakeQuiz from './components/TakeQuiz';
import QuizResults from './components/QuizResults';
import AttendQuiz from './components/AttendQuiz';
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: '2rem',
          minWidth: '350px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* ✅ Navbar only visible after login */}
        {!hideNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-quiz" element={<QuizForm />} />
          <Route path="/add-question" element={<QuestionForm quizzes={quizzes} />} />
          <Route path="/take-quiz" element={<TakeQuiz quizzes={quizzes} />} />
          <Route path="/take-quiz/:quizId" element={<AttendQuiz />} />
          <Route path="/results/:quizId" element={<QuizResults />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
