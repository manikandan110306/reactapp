// src/components/TakeQuiz.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TakeQuiz({ quizzes }) {
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (!selectedQuizId) {
      alert("Please select a quiz first!");
      return;
    }
    // navigate to AttendQuiz
    navigate(`/take-quiz/${selectedQuizId}`);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h3 style={{ color: "#2193b0", marginBottom: "1.5rem" }}>Take a Quiz</h3>
      <select
        value={selectedQuizId}
        onChange={(e) => setSelectedQuizId(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          border: "1px solid #ddd",
          borderRadius: "6px",
          marginBottom: "1rem",
        }}
      >
        <option value="">-- Select a Quiz --</option>
        {quizzes.map((quiz) => (
          <option key={quiz.id} value={quiz.id}>
            {quiz.title}
          </option>
        ))}
      </select>

      <button
        onClick={handleStartQuiz}
        style={{
          background: "#2193b0",
          color: "white",
          border: "none",
          padding: "0.75rem 1.5rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Start Quiz
      </button>
    </div>
  );
}
