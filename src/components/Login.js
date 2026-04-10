import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        const role = response.data.role;
        if (role === "ADMIN") navigate("/admin");
        else if (role === "TEACHER") navigate("/teacher");
        else navigate("/student");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">🎯</div>
          <h1>QuizMaster Pro</h1>
          <p>The modern quiz platform for educators and learners. Create, assign, and track quizzes with ease.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📋</div>
              <span>Create unlimited quizzes with rich question types</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🎓</div>
              <span>Assign quizzes to individual students</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">📊</div>
              <span>Track results and view leaderboards in real-time</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container animate-pop">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">Sign in to your QuizMaster account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--gray-500)" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
