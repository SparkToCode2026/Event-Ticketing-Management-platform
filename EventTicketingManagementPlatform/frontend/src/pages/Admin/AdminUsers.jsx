import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

const ROLES = ["Attendee", "Organizer", "Admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/User");
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    setSavingId(userId);
    try {
      await apiRequest(`/api/User/${userId}/role`, "PATCH", { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message || "Failed to update role.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(userId, userName) {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;

    try {
      await apiRequest(`/api/User/${userId}`, "DELETE");
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err) {
      alert(err.message || "Failed to delete user.");
    }
  }

  if (loading) return <div className="admin-users-container"><p>Loading users...</p></div>;

  return (
    <div className="admin-users-container">
      <h1>Manage Users</h1>
      {error && <p className="error-text">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Organizer Profile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.userName}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  disabled={savingId === u.userId}
                  onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td>{u.organizerProfile ? "✅ Yes" : "—"}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(u.userId, u.userName)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}