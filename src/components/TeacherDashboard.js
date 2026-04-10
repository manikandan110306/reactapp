import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assign modal
  const [assignModal, setAssignModal] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignMsg, setAssignMsg] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, sRes] = await Promise.all([
        axios.get("http://localhost:8080/api/quizzes/get"),
        axios.get("http://localhost:8080/api/quizzes/students"),
      ]);
      setQuizzes(Array.isArray(qRes.data) ? qRes.data : []);
      setStudents(Array.isArray(sRes.data) ? sRes.data : []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz and all its data?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch { alert("Failed to delete quiz."); }
  };

  const openAssign = (quizId) => { setAssignModal(quizId); setSelectedStudents([]); setAssignMsg(""); };
  const toggleStudent = (id) =>
    setSelectedStudents((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const handleAssign = async () => {
    if (selectedStudents.length === 0) { setAssignMsg("Select at least one student."); return; }
    setAssignLoading(true);
    try {
      await axios.post(`http://localhost:8080/api/quizzes/${assignModal}/assign`, { studentIds: selectedStudents });
      setAssignMsg("✅ Quiz assigned successfully!");
      setTimeout(() => setAssignModal(null), 1500);
    } catch { setAssignMsg("❌ Failed to assign. Please try again."); }
    finally { setAssignLoading(false); }
  };

  const initials = (name) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "T";

  return (
    <div className="app-shell">
      {/* Navbar */}
      <nav className="navbar-top">
        <span className="navbar-brand">🎯 QuizMaster Pro</span>
        <span className="navbar-spacer" />
        <div className="navbar-user-chip">
          <div className="navbar-avatar" style={{ background: "#4338CA" }}>{initials(user.name)}</div>
          <span>{user.name}</span>
          <span className="badge-role" style={{ background: "#EEF2FF", color: "#3730A3" }}>Teacher</span>
        </div>
        <button className="btn-nav-logout" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>
          Logout
        </button>
      </nav>

      <div className="page-container">
        {/* Header */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 className="page-title">Teacher Dashboard</h1>
            <p className="page-subtitle">Create quizzes and assign them to your students</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/quiz-builder")}>
            + Create New Quiz
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div><div className="stat-value">{quizzes.length}</div><div className="stat-label">Total Quizzes</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🎓</div>
            <div><div className="stat-value">{students.length}</div><div className="stat-label">Students</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">⏱️</div>
            <div>
              <div className="stat-value">{quizzes.reduce((s, q) => s + (q.timeLimit || 0), 0)}</div>
              <div className="stat-label">Total Minutes</div>
            </div>
          </div>
        </div>

        {/* Quiz Table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="card-header" style={{ padding: "1.25rem 1.5rem" }}>
            <span className="card-title">My Quizzes</span>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /><span>Loading quizzes...</span></div>
          ) : quizzes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">No quizzes yet</div>
              <p className="empty-state-subtitle">Click "Create New Quiz" to build your first quiz.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Title</th><th>Description</th><th>Time</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--gray-900)" }}>{quiz.title}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>ID: {quiz.id}</div>
                      </td>
                      <td style={{ color: "var(--gray-600)", maxWidth: 260 }}>
                        {quiz.description || <em style={{ color: "var(--gray-300)" }}>—</em>}
                      </td>
                      <td>
                        <span style={{ background: "var(--gray-100)", padding: "0.3rem 0.75rem", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600 }}>
                          {quiz.timeLimit} min
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openAssign(quiz.id)}>
                            👥 Assign
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(quiz.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setAssignModal(null)}>
          <div className="modal-box animate-pop">
            <h3 className="modal-title">Assign Quiz to Students</h3>
            <p style={{ color: "var(--gray-500)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Select students who should take this quiz.
            </p>
            {students.length === 0 ? (
              <div className="alert alert-info">No students registered yet.</div>
            ) : (
              <div className="student-checkbox-list">
                {students.map((s) => (
                  <div key={s.id} className={`student-checkbox-item ${selectedStudents.includes(s.id) ? "checked" : ""}`}
                    onClick={() => toggleStudent(s.id)}>
                    <div className="navbar-avatar" style={{ width: 36, height: 36, fontSize: "0.8rem", background: "#10B981" }}>
                      {s.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>{s.email}</div>
                    </div>
                    <div style={{ marginLeft: "auto" }}><input type="checkbox" readOnly checked={selectedStudents.includes(s.id)} /></div>
                  </div>
                ))}
              </div>
            )}
            {assignMsg && <div className={`alert ${assignMsg.includes("✅") ? "alert-success" : "alert-error"}`}>{assignMsg}</div>}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAssign} disabled={assignLoading}>
                {assignLoading ? "Assigning..." : "Assign →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
