import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import "../styles/Profile.css";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [userName, setUserName] = useState(user?.userName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updated = await apiRequest(
        `/api/User/${user.userId}`,
        "PUT",
        {
          userName,
          email,
        }
      );

      const newUser = {
        ...user,
        userName: updated.userName,
        email: updated.email,
      };

      localStorage.setItem("user", JSON.stringify(newUser));

      if (setUser) {
        setUser(newUser);
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {message && (
        <p className="success-text">
          {message}
        </p>
      )}

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="userName">Username</label>

          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="role">Role</label>

          <input
            type="text"
            id="role"
            value={user?.role || ""}
            disabled
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="appearance-section">
        <h2>Appearance</h2>

        <div className="appearance-option">
          <span>Theme</span>

          <button type="button" onClick={toggleTheme}>
            {theme === "light"
              ? "🌙 Dark Mode"
              : "☀️ Light Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}