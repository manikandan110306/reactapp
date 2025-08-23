import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function QuizResults() {
  const { id } = useParams(); // the attempt ID from URL
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await axios.get(`http://localhost:8080/api/quiz-attempts/${id}`);
        setResult(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load result.");
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [id]);

  if (loading) return <p>Loading result...</p>;
  if (error) return <p>{error}</p>;
  if (!result) return <p>No results to display.</p>;

  const percentage = ((result.score / result.totalQuestions) * 100).toFixed(2);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Quiz Results</h2>
      <p><strong>Student Name:</strong> {result.studentName}</p>
      <p><strong>Quiz Title:</strong> {result.quizTitle}</p>
      <p><strong>Score:</strong> {result.score} / {result.totalQuestions}</p>
      <p><strong>Percentage:</strong> {percentage}%</p>
      <button
        onClick={() => navigate("/home")}
        style={{ padding: "0.75rem 1.5rem", borderRadius: "6px", background: "#2193b0", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Return to Home
      </button>
    </div>
  );
}
