import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

export default function AdminOrganizers() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newUserId, setNewUserId] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [creating, setCreating] = useState(false);

  const [reassignValues, setReassignValues] = useState({});

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/OrganizerProfile");
      setProfiles(data);
    } catch (err) {
      setError(err.message || "Failed to load organizer profiles.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newUserId || !newCompanyName) return;

    setCreating(true);
    try {
      await apiRequest("/api/OrganizerProfile", "POST", {
        userId: Number(newUserId),
        companyName: newCompanyName,
      });
      setNewUserId("");
      setNewCompanyName("");
      loadProfiles();
    } catch (err) {
      alert(err.message || "Failed to create organizer profile.");
    } finally {
      setCreating(false);
    }
  }

  async function handleReassign(profileId) {
    const targetUserId = reassignValues[profileId];
    if (!targetUserId) return;

    try {
      await apiRequest(
        `/api/OrganizerProfile/${profileId}/user?newUserId=${targetUserId}`,
        "PATCH"
      );
      loadProfiles();
    } catch (err) {
      alert(err.message || "Failed to reassign profile.");
    }
  }

  async function handleDelete(profileId, companyName) {
    if (!confirm(`Delete organizer profile "${companyName}"? This cannot be undone.`)) return;

    try {
      await apiRequest(`/api/OrganizerProfile/${profileId}`, "DELETE");
      setProfiles((prev) => prev.filter((p) => p.organizerId !== profileId));
    } catch (err) {
      alert(err.message || "Failed to delete profile.");
    }
  }

  if (loading) return <div className="admin-users-container"><p>Loading organizer profiles...</p></div>;

  return (
    <div className="admin-users-container">
      <h1>Manage Organizer Profiles</h1>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <input
          type="number"
          placeholder="User ID"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea" }}
        />
        <input
          type="text"
          placeholder="Company Name"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea", flex: 1 }}
        />
        <button type="submit" disabled={creating} className="delete-btn" style={{ background: "#fde047", color: "#1e293b" }}>
          {creating ? "Creating..." : "Create Profile"}
        </button>
      </form>

      <table className="admin-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Company</th>
      <th>Owner (User)</th>
      <th>Email</th>
      <th>Events</th>
      <th>Reassign</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {profiles.map((p) => (
      <tr key={p.organizerId}>
        <td>{p.organizerId}</td>
        <td>{p.companyName}</td>
        <td>{p.user?.userName || "—"}</td>
        <td>{p.user?.email || "—"}</td>
        <td>{p.events?.length ?? 0}</td>
        <td>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="number"
              placeholder="New User ID"
              style={{ width: "90px", padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea" }}
              onChange={(e) =>
                setReassignValues((prev) => ({ ...prev, [p.organizerId]: e.target.value }))
              }
            />
            <button onClick={() => handleReassign(p.organizerId)} className="delete-btn" style={{ background: "#e0f2fe", color: "#0369a1" }}>
              Go
            </button>
          </div>
        </td>
        <td>
          <button className="delete-btn" onClick={() => handleDelete(p.organizerId, p.companyName)}>
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