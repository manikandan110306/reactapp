import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AttendQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!quizId) return;

    setLoading(true);
    axios
      .get(`http://localhost:8080/api/quizzes/${quizId}/questions/get`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        setLoading(false);
      });
  }, [quizId]);

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    if (!allAnswered) {
      alert("Please answer all questions before submitting!");
      return;
    }

    const payload = {
      quizId: parseInt(quizId),
      studentId: user.id,
      answers: questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id],
      })),
    };

    try {
      setSubmitting(true);
      const res = await axios.post(
        "http://localhost:8080/api/quiz-attempts",
        payload
      );
      alert("Quiz submitted successfully!");
      navigate(`/results/${quizId}`);
    } catch (err) {
      console.error("Failed to submit quiz:", err.response || err);
      alert(
        err.response?.data?.message || "Failed to submit quiz. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Attempt Quiz</h2>

      {questions.map((q, idx) => (
        <div
          key={q.id}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        >
          <p>
            {idx + 1}. {q.questionText}
          </p>
          {q.options.map((opt) => (
            <label
              key={opt.id}
              style={{ display: "block", marginTop: "0.25rem" }}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt.id}
                checked={answers[q.id] === opt.id}
                onChange={() => handleOptionChange(q.id, opt.id)}
              />
              <span style={{ marginLeft: "0.5rem" }}>{opt.optionText}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
        style={{
          marginTop: "1rem",
          backgroundColor: allAnswered ? "#2193b0" : "#aaa",
          color: "white",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "6px",
          cursor: allAnswered ? "pointer" : "not-allowed",
        }}
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}
