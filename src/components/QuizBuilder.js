import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OPTION_LETTERS = ["A", "B", "C", "D"];

const emptyOption = () => ({ optionText: "", correct: false });
const emptyQuestion = () => ({
  questionText: "",
  questionType: "MULTIPLE_CHOICE",
  options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
});

export default function QuizBuilder() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const dashboardPath = user.role === "ADMIN" ? "/admin" : "/teacher";
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("details"); // "details" | "questions"

  const updateQuestion = (qi, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qi] = { ...updated[qi], [field]: value };
      if (field === "questionType" && value === "TRUE_FALSE") {
        updated[qi].options = [
          { optionText: "True", correct: false },
          { optionText: "False", correct: false },
        ];
      } else if (field === "questionType" && value === "MULTIPLE_CHOICE") {
        updated[qi].options = [emptyOption(), emptyOption(), emptyOption(), emptyOption()];
      }
      return updated;
    });
  };

  const updateOption = (qi, oi, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = [...updated[qi].options];
      if (field === "correct") {
        // radio — only one correct for MULTIPLE_CHOICE
        opts.forEach((o, i) => (opts[i] = { ...o, correct: i === oi }));
      } else {
        opts[oi] = { ...opts[oi], [field]: value };
      }
      updated[qi] = { ...updated[qi], options: opts };
      return updated;
    });
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (qi) =>
    setQuestions((prev) => prev.filter((_, i) => i !== qi));

  const handlePublish = async () => {
    if (!quizTitle.trim()) { setError("Please enter a quiz title."); return; }
    if (questions.some((q) => !q.questionText.trim())) { setError("All questions need text."); return; }
    setLoading(true);
    setError("");
    try {
      // Step 1: Create quiz
      const quizRes = await axios.post("http://localhost:8080/api/quizzes", {
        title: quizTitle,
        description: quizDesc,
        timeLimit: parseInt(timeLimit),
      });
      const quizId = quizRes.data.id;

      // Step 2: Post each question sequentially
      for (const q of questions) {
        await axios.post(`http://localhost:8080/api/quizzes/${quizId}/questions`, {
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options.map((o) => ({ optionText: o.optionText, isCorrect: o.correct })),
        });
      }

      navigate(dashboardPath);
    } catch (err) {
      setError("Failed to publish quiz. Check the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">Quiz Builder</h1>
          <p className="page-subtitle">Create a quiz with questions in one seamless flow</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-secondary" onClick={() => navigate(dashboardPath)}>Cancel</button>
          <button className="btn btn-primary" onClick={handlePublish} disabled={loading}>
            {loading ? "Publishing..." : "🚀 Publish Quiz"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Quiz Details Card */}
      <div className="builder-section animate-pop" style={{ marginBottom: "1.5rem" }}>
        <div className="card-header">
          <span className="card-title">📋 Quiz Details</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Quiz Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 'JavaScript Fundamentals Chapter 1'"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              placeholder="What will students learn from this quiz?"
              value={quizDesc}
              onChange={(e) => setQuizDesc(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Time Limit (minutes)</label>
            <input
              type="number"
              className="form-input"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Total Questions</label>
            <input type="text" className="form-input" value={`${questions.length} question${questions.length !== 1 ? "s" : ""}`} readOnly />
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, qi) => (
        <div key={qi} className="question-block animate-pop">
          <div className="question-block-header">
            <span className="question-block-title">Question {qi + 1}</span>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <select
                className="form-input"
                style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                value={q.questionType}
                onChange={(e) => updateQuestion(qi, "questionType", e.target.value)}
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True / False</option>
              </select>
              {questions.length > 1 && (
                <button className="btn btn-danger btn-sm" onClick={() => removeQuestion(qi)}>Remove</button>
              )}
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder={`Enter question ${qi + 1}...`}
              value={q.questionText}
              onChange={(e) => updateQuestion(qi, "questionText", e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {q.options.map((opt, oi) => (
              <div key={oi} className="option-row">
                <div style={{
                  width: "30px", height: "30px", background: opt.correct ? "var(--success)" : "var(--gray-200)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: "800", color: opt.correct ? "#fff" : "var(--gray-500)",
                  flexShrink: 0, transition: "var(--transition)"
                }}>
                  {OPTION_LETTERS[oi]}
                </div>
                <input
                  type="text"
                  className="option-text"
                  placeholder={`Option ${OPTION_LETTERS[oi]}`}
                  value={opt.optionText}
                  onChange={(e) => updateOption(qi, oi, "optionText", e.target.value)}
                />
                <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-600)", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input
                    type="radio"
                    name={`correct-q${qi}`}
                    className="correct-radio"
                    checked={opt.correct}
                    onChange={() => updateOption(qi, oi, "correct", true)}
                  />
                  Correct
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="btn btn-outline btn-full" style={{ marginBottom: "2rem" }} onClick={addQuestion}>
        + Add Question
      </button>
    </div>
  );
}
