import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser]   = useState(JSON.parse(localStorage.getItem("user")) || {});

  const [editName, setEditName]       = useState(user.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [saving, setSaving]           = useState(false);
  const [msg, setMsg]                 = useState(null); // { type: 'success'|'error', text }

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const ROLE_META = {
    ADMIN:   { label: "Admin",   icon: "👑", color: "#92400E", bg: "#FEF3C7", dash: "/admin"   },
    TEACHER: { label: "Teacher", icon: "🧑‍🏫", color: "#3730A3", bg: "#EEF2FF", dash: "/teacher" },
    STUDENT: { label: "Student", icon: "🎓", color: "#065F46", bg: "#D1FAE5", dash: "/student" },
  };
  const meta = ROLE_META[user.role] || ROLE_META.STUDENT;

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPw) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (!editName.trim()) {
      setMsg({ type: "error", text: "Name cannot be empty." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const body = { name: editName.trim() };
      if (newPassword) body.password = newPassword;
      const res = await axios.put(`http://localhost:8080/api/auth/users/${user.id}/profile`, body);
      const updated = res.data;
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setEditName(updated.name);
      setNewPassword("");
      setConfirmPw("");
      setMsg({ type: "success", text: "✅ Profile updated successfully!" });
    } catch {
      setMsg({ type: "error", text: "❌ Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      {/* Navbar */}
      <nav className="navbar-top">
        <span className="navbar-brand" style={{ cursor: "pointer" }} onClick={() => navigate(meta.dash)}>🎯 QuizMaster Pro</span>
        <span className="navbar-spacer" />
        <div className="navbar-user-chip">
          <div className="navbar-avatar">{initials(user.name)}</div>
          <span>{user.name}</span>
          <span className="badge-role" style={{ background: meta.bg, color: meta.color }}>
            {meta.label}
          </span>
        </div>
        <button
          className="btn-nav-logout"
          style={{ marginRight: "0.5rem" }}
          onClick={() => navigate(meta.dash)}
        >
          ← Dashboard
        </button>
        <button className="btn-nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="page-container" style={{ maxWidth: 760 }}>
        {/* Hero card */}
        <div
          className="card animate-pop"
          style={{
            background: `linear-gradient(135deg, ${meta.bg} 0%, #fff 100%)`,
            border: `1.5px solid ${meta.color}22`,
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            padding: "2rem",
          }}
        >
          {/* Large Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${meta.color}cc, ${meta.color}88)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: `0 4px 20px ${meta.color}44`,
            }}
          >
            {initials(user.name)}
          </div>
          <div>
            <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--gray-900)", letterSpacing: "-0.5px" }}>
              {user.name}
            </div>
            <div style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginTop: "0.2rem" }}>
              {user.email}
            </div>
            <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "1.25rem" }}>{meta.icon}</span>
              <span
                style={{
                  background: meta.bg,
                  color: meta.color,
                  border: `1px solid ${meta.color}33`,
                  padding: "0.25rem 0.875rem",
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {meta.label}
              </span>
            </div>
          </div>
          {/* User ID chip */}
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              User ID
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-700)" }}>
              #{user.id}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">✏️ Edit Profile</span>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              id="profile-name"
              className="form-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {/* Email — read-only */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="profile-email"
              className="form-input"
              value={user.email}
              readOnly
              style={{ background: "var(--gray-50)", color: "var(--gray-400)", cursor: "not-allowed" }}
            />
            <span className="form-hint">Email cannot be changed.</span>
          </div>

          {/* Role — read-only */}
          <div className="form-group">
            <label className="form-label">Role</label>
            <input
              id="profile-role"
              className="form-input"
              value={meta.label}
              readOnly
              style={{ background: "var(--gray-50)", color: "var(--gray-400)", cursor: "not-allowed" }}
            />
            <span className="form-hint">Role is managed by an admin.</span>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--gray-100)", margin: "0.5rem 0 1.25rem" }} />
          <div style={{ fontWeight: 700, color: "var(--gray-700)", marginBottom: "1rem", fontSize: "0.95rem" }}>
            🔒 Change Password
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              id="profile-new-password"
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              id="profile-confirm-password"
              type="password"
              className="form-input"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          {msg && (
            <div
              className={`alert ${msg.type === "success" ? "alert-success" : "alert-error"}`}
              style={{ marginBottom: "1rem" }}
            >
              {msg.text}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              id="profile-save-btn"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => navigate(meta.dash)}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Quick info strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {[
            { icon: "📧", label: "Email", value: user.email },
            { icon: "🏷️", label: "Role", value: meta.label },
            { icon: "🆔", label: "Account ID", value: `#${user.id}` },
          ].map((item) => (
            <div
              key={item.label}
              className="stat-card"
              style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.4rem" }}
            >
              <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--gray-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {item.label}
              </span>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--gray-800)", wordBreak: "break-all" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
