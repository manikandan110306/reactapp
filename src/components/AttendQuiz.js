import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function AttendQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackState, setFeedbackState] = useState(null); // 'correct' | 'incorrect'
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || { id: 1, name: "Student" };

  useEffect(() => {
    if (!quizId) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/quizzes/${quizId}/questions/get`)
      .then((res) => { setQuestions(res.data); setLoading(false); })
      .catch((err) => { console.error("Failed to fetch questions:", err); setLoading(false); });
  }, [quizId]);

  const handleOptionClick = (option) => {
    if (feedbackState || submitting) return;
    const q = questions[currentIndex];
    const newAnswers = { ...answers, [q.id]: option.id };
    setAnswers(newAnswers);
    setSelectedOptionId(option.id);
    const isCorrect = option.correct !== undefined ? option.correct : option.isCorrect;
    setFeedbackState(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedbackState(null);
      setSelectedOptionId(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        submitQuiz(newAnswers);
      }
    }, 1200);
  };

  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const payload = {
        quizId: parseInt(quizId),
        studentName: user.name || "Student",
        answers: questions.map((q) => ({
          questionId: q.id,
          selectedOptionId: finalAnswers[q.id],
        })),
        totalQuestions: questions.length,
      };
      await axios.post("http://localhost:8080/api/quiz-attempts", payload);
      navigate(`/results/${quizId}`);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit quiz. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="quiz-game-fullscreen">
      <div className="loading-spinner" style={{ color: "rgba(255,255,255,0.7)" }}>
        <div className="spinner" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#818CF8" }} />
        <span>Getting your quiz ready...</span>
      </div>
    </div>
  );

  if (submitting) return (
    <div className="quiz-game-fullscreen">
      <div className="loading-spinner" style={{ color: "rgba(255,255,255,0.7)" }}>
        <div className="spinner" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#10B981" }} />
        <span>Calculating your score...</span>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="quiz-game-fullscreen">
      <div style={{ textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No Questions Yet</h2>
        <p style={{ opacity: 0.7, marginBottom: "2rem" }}>This quiz has no questions to display.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="quiz-game-fullscreen">
      <div className="quiz-game-container animate-pop">
        {/* Progress Header */}
        <div className="quiz-progress-header">
          <span className="quiz-counter">{currentIndex + 1} / {questions.length}</span>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <span className="question-number-badge">Q{currentIndex + 1}</span>
        </div>

        {/* Question */}
        <div className="question-text">{currentQ.questionText}</div>

        {/* Options */}
        <div className="options-grid">
          {currentQ.options.map((opt, oi) => {
            const isSelected = selectedOptionId === opt.id;
            const optCorrect = opt.correct !== undefined ? opt.correct : opt.isCorrect;
            let cls = "option-btn";
            if (feedbackState && isSelected) cls += feedbackState === "correct" ? " correct" : " incorrect";
            else if (feedbackState && optCorrect) cls += " correct";

            return (
              <button
                key={opt.id}
                className={cls}
                onClick={() => handleOptionClick(opt)}
                disabled={!!feedbackState}
              >
                <span className="option-letter">{OPTION_LETTERS[oi]}</span>
                {opt.optionText}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
