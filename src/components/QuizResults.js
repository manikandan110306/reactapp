// src/components/QuizResults.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (quizId) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/quiz-attempts/quizzes/${quizId}/attempts`)
        .then((res) => {
          setAttempts(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch quiz results:", err);
          setLoading(false);
        });
    } else {
      setLoading(true);
      axios
        .get("http://localhost:8080/api/quizzes")
        .then((res) => {
          setQuizzes(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch quizzes:", err);
          setLoading(false);
        });
    }
  }, [quizId]);

  if (loading) return <p>Loading...</p>;

  // Show quiz list if no quizId
  if (!quizId) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <h2>All Quizzes</h2>
        {quizzes.length === 0 && <p>No quizzes found.</p>}
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              padding: "0.5rem",
              border: "1px solid #ddd",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/results/${quiz.id}`)}
          >
            {quiz.title || `Quiz #${quiz.id}`}
          </div>
        ))}
      </div>
    );
  }

  // Show attempts for selected quiz
  if (attempts.length === 0) return <p>No results found for this quiz.</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Quiz Results</h2>
      {attempts.map((attempt) => {
        // Safe access: check if username exists directly or inside user object
        const username = attempt.username || attempt.user?.username || "Unknown Student";

        return (
          <div
            key={attempt.id}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>Student:</strong> {user.name}
            </p>
            <p>
              <strong>Score:</strong> {attempt.score} / {attempt.totalQuestions}
            </p>
          </div>
        );
      })}
    </div>
  );
}
