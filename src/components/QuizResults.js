import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Student" };
  const isAdmin = user.role === "ADMIN";

  useEffect(() => {
    if (!quizId) return;
    axios
      .get(`http://localhost:8080/api/quiz-attempts/quizzes/${quizId}/attempts`)
      .then((res) => {
        let data = Array.isArray(res.data) ? res.data : [];
        data.sort((a, b) => b.score - a.score); // sort by score desc
        setAttempts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [quizId]);

  if (loading) return (
    <div className="results-page">
      <div className="loading-spinner" style={{ color: "rgba(255,255,255,0.7)" }}>
        <div className="spinner" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#818CF8" }} />
        <span>Loading your results...</span>
      </div>
    </div>
  );

  const myAttempt = attempts.find(
    (a) => (a.studentName || "").toLowerCase() === (user.name || "").toLowerCase()
  ) || attempts[0];

  if (!myAttempt) return (
    <div className="results-page">
      <div className="results-card animate-pop" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
        <h2 style={{ marginBottom: "1rem" }}>No Results Found</h2>
        <button className="btn btn-primary" onClick={() => navigate(isAdmin ? "/admin" : "/student")}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  const score = myAttempt.score || 0;
  const total = myAttempt.totalQuestions || 1;
  const pct = Math.round((score / total) * 100);

  let emoji = "😢", label = "Keep Practicing!", color = "#EF4444";
  if (pct >= 90) { emoji = "🏆"; label = "Outstanding!"; color = "#F59E0B"; }
  else if (pct >= 75) { emoji = "🎉"; label = "Great Job!"; color = "#10B981"; }
  else if (pct >= 50) { emoji = "👍"; label = "Good Effort!"; color = "#4F46E5"; }

  const bgGradient = `conic-gradient(${color} ${pct}%, #f3f4f6 0)`;

  return (
    <div className="results-page">
      <div className="results-card animate-pop">
        <div style={{ marginBottom: "0.25rem", fontSize: "2.5rem" }}>{emoji}</div>
        <div className="results-badge">{label}</div>
        <p className="results-sub">You completed the quiz — here's how you did</p>

        {/* Score Ring */}
        <div className="results-score-ring">
          <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={color} strokeWidth="2.5"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center"
          }}>
            <div className="results-score-text" style={{ color }}>{pct}%</div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", fontWeight: 600 }}>Score</div>
          </div>
        </div>

        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          {score} out of {total} correct
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "2rem", fontSize: "0.875rem", color: "var(--gray-500)" }}>
          <span>📝 {total} questions</span>
          <span style={{ color: "#10B981" }}>✅ {score} correct</span>
          <span style={{ color: "#EF4444" }}>❌ {total - score} wrong</span>
        </div>

        <button className="btn btn-primary btn-full btn-lg" style={{ marginBottom: "1rem" }}
          onClick={() => navigate(isAdmin ? "/admin" : "/student")}>
          Back to Dashboard
        </button>

        {/* Leaderboard */}
        {attempts.length > 1 && (
          <div style={{ marginTop: "2rem", textAlign: "left", borderTop: "1px solid var(--gray-100)", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--gray-900)" }}>
              🏅 Leaderboard
            </h3>
            {attempts.map((a, idx) => {
              const p = Math.round(((a.score || 0) / (a.totalQuestions || 1)) * 100);
              const isMe = (a.studentName || "").toLowerCase() === (user.name || "").toLowerCase();
              return (
                <div key={a.id} className="leaderboard-item" style={isMe ? { border: "1.5px solid var(--brand-primary)", background: "#EEF2FF" } : {}}>
                  <div className="leaderboard-rank">#{idx + 1}</div>
                  <div className="navbar-avatar" style={{ width: "32px", height: "32px", fontSize: "0.75rem" }}>
                    {(a.studentName || "S")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      {a.studentName || "Student"} {isMe && <span style={{ color: "var(--brand-primary)", fontSize: "0.75rem" }}>(You)</span>}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: idx === 0 ? "#92400E" : "var(--gray-700)" }}>
                    {a.score}/{a.totalQuestions} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--gray-400)" }}>{p}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
