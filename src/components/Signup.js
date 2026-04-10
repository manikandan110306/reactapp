import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/signup", {
        name,
        email,
        password,
        role, // TEACHER or STUDENT only — backend enforces this
      });
      if (res.data === "Signup successful") {
        navigate("/");
      } else {
        setError(res.data || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data || "Signup failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">🎯</div>
          <h1>Join QuizMaster Pro</h1>
          <p>Sign up as a Teacher to create and manage quizzes, or as a Student to take your assigned quizzes.</p>
          <div className="auth-features">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🧑‍🏫</div>
              <span>Teachers create quizzes and assign them to students</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🎓</div>
              <span>Students see only their personal quiz inbox</span>
            </div>
            <div className="auth-feature-item">
              <div className="auth-feature-icon">🔒</div>
              <span>Admin access is granted by the platform administrator</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container animate-pop">
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Educators and students sign up here. Admin access is not available via signup.</p>

          {error && (
            <div className="alert alert-error">
              {typeof error === "object" ? JSON.stringify(error) : error}
            </div>
          )}

          {/* Role Selector — Teacher or Student only */}
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className="role-selector">
              <div
                className={`role-option ${role === "TEACHER" ? "selected" : ""}`}
                onClick={() => setRole("TEACHER")}
              >
                <div className="role-icon">🧑‍🏫</div>
                <div className="role-label">Teacher</div>
                <div style={{ fontSize: "0.72rem", color: "var(--gray-400)", marginTop: "0.2rem" }}>Create & assign quizzes</div>
              </div>
              <div
                className={`role-option ${role === "STUDENT" ? "selected" : ""}`}
                onClick={() => setRole("STUDENT")}
              >
                <div className="role-icon">🎓</div>
                <div className="role-label">Student</div>
                <div style={{ fontSize: "0.72rem", color: "var(--gray-400)", marginTop: "0.2rem" }}>Take assigned quizzes</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--gray-500)" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "var(--brand-primary)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
