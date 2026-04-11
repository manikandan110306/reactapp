import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return;
    axios
      .get(`http://localhost:8080/api/quizzes/assigned/${user.id}`)
      .then((res) => setQuizzes(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to load quizzes", err))
      .finally(() => setLoading(false));
  }, [user.id]);

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "S";

  const QUIZ_COLORS = ["#EEF2FF", "#D1FAE5", "#FEF3C7", "#FCE7F3", "#CFFAFE"];
  const QUIZ_ICONS = ["📚", "🧠", "🔬", "🎯", "💡", "🌍", "⚡", "🎨"];

  return (
    <div className="app-shell">
      {/* Navbar */}
      <nav className="navbar-top">
        <span className="navbar-brand" onClick={() => navigate("/student")}>🎯 QuizMaster Pro</span>
        <span className="navbar-spacer" />
        <div className="navbar-user-chip">
          <div className="navbar-avatar">{initials(user.name)}</div>
          <span>{user.name}</span>
          <span className="badge-role badge-student">Student</span>
        </div>
        <button
          className="btn-nav-logout"
          style={{ marginRight: "0.5rem" }}
          onClick={() => navigate("/profile")}
        >
          👤 Profile
        </button>
        <button className="btn-nav-logout" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>
          Logout
        </button>
      </nav>

      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">My Quiz Inbox</h1>
          <p className="page-subtitle">Quizzes assigned to you by your educators</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📬</div>
            <div>
              <div className="stat-value">{quizzes.length}</div>
              <div className="stat-label">Assigned Quizzes</div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /><span>Loading your quizzes...</span></div>
        ) : quizzes.length === 0 ? (
          <div className="empty-state" style={{ background: "#fff", borderRadius: "16px", boxShadow: "var(--shadow-card)" }}>
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No quizzes assigned yet</div>
            <p className="empty-state-subtitle">
              Your teacher hasn't assigned any quizzes to you yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz, idx) => (
              <div
                key={quiz.id}
                className="quiz-card animate-pop"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                <div
                  className="quiz-icon"
                  style={{
                    background: QUIZ_COLORS[idx % QUIZ_COLORS.length],
                    fontSize: "1.75rem",
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {QUIZ_ICONS[idx % QUIZ_ICONS.length]}
                </div>
                <div className="quiz-title">{quiz.title}</div>
                <div className="quiz-desc">{quiz.description || "Click to start the quiz"}</div>
                <div className="quiz-meta">
                  <span>⏱ {quiz.timeLimit} min</span>
                </div>
                <div className="quiz-actions">
                  <button
                    className="btn btn-primary btn-full"
                    onClick={(e) => { e.stopPropagation(); navigate(`/quiz/${quiz.id}`); }}
                  >
                    Start Quiz →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
