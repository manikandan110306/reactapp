import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizForm from "./QuizForm";
import TakeQuiz from "./TakeQuiz";

const QuizPage = () => {
  const [view, setView] = useState("create"); // "create" or "take"
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/quizzes");
      setQuizzes(res.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setView("create")}
          style={{
            background: view === "create" ? "#2193b0" : "white",
            color: view === "create" ? "white" : "#2193b0",
            border: "1px solid #2193b0",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Create Quiz
        </button>
        <button
          onClick={() => setView("take")}
          style={{
            background: view === "take" ? "#2193b0" : "white",
            color: view === "take" ? "white" : "#2193b0",
            border: "1px solid #2193b0",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Take Quiz
        </button>
      </div>

      {/* Conditional Rendering */}
      {view === "create" ? (
        <QuizForm />
      ) : (
        <TakeQuiz quizzes={quizzes} />
      )}
    </div>
  );
};

export default QuizPage;
