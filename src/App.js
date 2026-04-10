import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import QuizBuilder from './components/QuizBuilder';
import QuizResults from './components/QuizResults';
import AttendQuiz from './components/AttendQuiz';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin only */}
        <Route path="/admin" element={<PrivateRoute allowedRoles={["ADMIN"]}><AdminDashboard /></PrivateRoute>} />

        {/* Teacher only */}
        <Route path="/teacher" element={<PrivateRoute allowedRoles={["TEACHER"]}><TeacherDashboard /></PrivateRoute>} />
        <Route path="/quiz-builder" element={<PrivateRoute allowedRoles={["TEACHER", "ADMIN"]}><QuizBuilder /></PrivateRoute>} />

        {/* Student only */}
        <Route path="/student" element={<PrivateRoute allowedRoles={["STUDENT"]}><StudentDashboard /></PrivateRoute>} />

        {/* Shared */}
        <Route path="/quiz/:quizId" element={<PrivateRoute><AttendQuiz /></PrivateRoute>} />
        <Route path="/take-quiz/:quizId" element={<PrivateRoute><AttendQuiz /></PrivateRoute>} />
        <Route path="/results/:quizId" element={<PrivateRoute><QuizResults /></PrivateRoute>} />

        {/* Legacy/generic redirects */}
        <Route path="/home" element={<PrivateRoute><RoleRedirect /></PrivateRoute>} />
        <Route path="/quizzes" element={<PrivateRoute><RoleRedirect /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

/** Redirect to the correct dashboard based on stored role. */
function RoleRedirect() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  if (user.role === "TEACHER") return <Navigate to="/teacher" replace />;
  return <Navigate to="/student" replace />;
}

export default App;
