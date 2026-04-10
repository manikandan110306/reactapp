import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ROLE_COLORS = {
  ADMIN: { bg: "#FEF3C7", color: "#92400E" },
  TEACHER: { bg: "#EEF2FF", color: "#3730A3" },
  STUDENT: { bg: "#D1FAE5", color: "#065F46" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [quizzes, setQuizzes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("quizzes"); // "quizzes" | "users"

  // Assign modal
  const [assignModal, setAssignModal] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignMsg, setAssignMsg] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Role modal
  const [roleModal, setRoleModal] = useState(null); // user object
  const [newRole, setNewRole] = useState("");
  const [roleMsg, setRoleMsg] = useState("");

  const fetchData = async () => {
    setLoadingQuizzes(true);
    setLoadingUsers(true);
    try {
      const [qRes, uRes] = await Promise.all([
        axios.get("http://localhost:8080/api/quizzes/get"),
        axios.get("http://localhost:8080/api/auth/users"),
      ]);
      setQuizzes(Array.isArray(qRes.data) ? qRes.data : []);
      // Filter out self from user list
      setAllUsers((Array.isArray(uRes.data) ? uRes.data : []).filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoadingQuizzes(false);
      setLoadingUsers(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Delete this quiz and all its data?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) { alert("Failed to delete quiz."); }
  };

  const students = allUsers.filter((u) => u.role === "STUDENT");

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

  const openRoleModal = (u) => { setRoleModal(u); setNewRole(u.role); setRoleMsg(""); };
  const handleRoleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/auth/users/${roleModal.id}/role`, { role: newRole });
      setAllUsers((prev) => prev.map((u) => (u.id === roleModal.id ? res.data : u)));
      setRoleMsg("✅ Role updated!");
      setTimeout(() => setRoleModal(null), 1200);
    } catch { setRoleMsg("❌ Failed to update role."); }
  };

  const initials = (name) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "A";

  return (
    <div className="app-shell">
      {/* Navbar */}
      <nav className="navbar-top">
        <span className="navbar-brand">🎯 QuizMaster Pro</span>
        <span className="navbar-spacer" />
        <div className="navbar-user-chip">
          <div className="navbar-avatar">{initials(user.name)}</div>
          <span>{user.name}</span>
          <span className="badge-role badge-admin">Admin</span>
        </div>
        <button className="btn-nav-logout" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>
          Logout
        </button>
      </nav>

      <div className="page-container">
        {/* Header */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Manage quizzes, teachers, and students across the entire platform</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>
            <div><div className="stat-value">{quizzes.length}</div><div className="stat-label">Total Quizzes</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">🧑‍🏫</div>
            <div><div className="stat-value">{allUsers.filter((u) => u.role === "TEACHER").length}</div><div className="stat-label">Teachers</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🎓</div>
            <div><div className="stat-value">{students.length}</div><div className="stat-label">Students</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">👥</div>
            <div><div className="stat-value">{allUsers.length}</div><div className="stat-label">Total Users</div></div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--gray-200)", paddingBottom: "0" }}>
          {["quizzes", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid var(--brand-primary)" : "2px solid transparent",
                color: activeTab === tab ? "var(--brand-primary)" : "var(--gray-500)",
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: "pointer",
                fontSize: "0.9rem",
                fontFamily: "Inter, sans-serif",
                marginBottom: "-1px",
              }}
            >
              {tab === "quizzes" ? "📋 Quizzes" : "👥 User Management"}
            </button>
          ))}
        </div>

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="card-header" style={{ padding: "1.25rem 1.5rem" }}>
              <span className="card-title">All Quizzes</span>
              <div style={{ color: "var(--gray-400)", fontSize: "0.8rem" }}>
                Teachers create quizzes — admins can view and delete them here
              </div>
            </div>
            {loadingQuizzes ? (
              <div className="loading-spinner"><div className="spinner" /><span>Loading...</span></div>
            ) : quizzes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <div className="empty-state-title">No quizzes yet</div>
                <p className="empty-state-subtitle">Teachers can create quizzes from their dashboard.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Title</th><th>Description</th><th>Time Limit</th><th>Actions</th></tr></thead>
                  <tbody>
                    {quizzes.map((quiz) => (
                      <tr key={quiz.id}>
                        <td><div style={{ fontWeight: 700 }}>{quiz.title}</div><div style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>ID: {quiz.id}</div></td>
                        <td style={{ color: "var(--gray-600)", maxWidth: 260 }}>{quiz.description || <em style={{ color: "var(--gray-300)" }}>—</em>}</td>
                        <td><span style={{ background: "var(--gray-100)", padding: "0.3rem 0.75rem", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600 }}>{quiz.timeLimit} min</span></td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn btn-outline btn-sm" onClick={() => openAssign(quiz.id)}>👥 Assign</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="card-header" style={{ padding: "1.25rem 1.5rem" }}>
              <span className="card-title">User Management</span>
              <div style={{ color: "var(--gray-400)", fontSize: "0.8rem" }}>
                Promote or demote user roles. Only admins can change roles.
              </div>
            </div>
            {loadingUsers ? (
              <div className="loading-spinner"><div className="spinner" /><span>Loading users...</span></div>
            ) : allUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-title">No users yet</div>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Current Role</th><th>Actions</th></tr></thead>
                  <tbody>
                    {allUsers.map((u) => {
                      const rc = ROLE_COLORS[u.role] || ROLE_COLORS.STUDENT;
                      return (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div className="navbar-avatar" style={{ width: 32, height: 32, fontSize: "0.75rem" }}>{initials(u.name)}</div>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ color: "var(--gray-500)" }}>{u.email}</td>
                          <td>
                            <span style={{ background: rc.bg, color: rc.color, padding: "0.3rem 0.75rem", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700 }}>
                              {u.role}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-outline btn-sm" onClick={() => openRoleModal(u)}>
                              ✏️ Change Role
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
                    <div className="navbar-avatar" style={{ width: 36, height: 36, fontSize: "0.8rem" }}>{s.name[0].toUpperCase()}</div>
                    <div><div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</div><div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>{s.email}</div></div>
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

      {/* Role Modal */}
      {roleModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setRoleModal(null)}>
          <div className="modal-box animate-pop">
            <h3 className="modal-title">Change Role for {roleModal.name}</h3>
            <p style={{ color: "var(--gray-500)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              Current role: <strong>{roleModal.role}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">New Role</label>
              <select className="form-input" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="STUDENT">🎓 Student</option>
                <option value="TEACHER">🧑‍🏫 Teacher</option>
                <option value="ADMIN">👑 Admin</option>
              </select>
            </div>
            <div className="alert alert-info" style={{ fontSize: "0.8rem" }}>
              ⚠️ Changing to ADMIN gives full platform access including user management.
            </div>
            {roleMsg && <div className={`alert ${roleMsg.includes("✅") ? "alert-success" : "alert-error"}`}>{roleMsg}</div>}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setRoleModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRoleUpdate}>Update Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
