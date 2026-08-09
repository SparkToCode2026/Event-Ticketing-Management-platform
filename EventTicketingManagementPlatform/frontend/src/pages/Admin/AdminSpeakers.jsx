// frontend/src/pages/admin/AdminSpeakers.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

export default function AdminSpeakers() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSpeakers();
  }, []);

  async function loadSpeakers() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/speaker/GetAllSpeakers");
      setSpeakers(data);
    } catch (err) {
      setError(err.message || "Failed to load speakers.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete speaker "${name}"? This cannot be undone.`)) return;

    try {
      await apiRequest(`/speaker/DeleteSpeaker?id=${id}`, "DELETE");
      setSpeakers((prev) => prev.filter((s) => s.speakerId !== id));
    } catch (err) {
      alert(err.message || "Failed to delete speaker.");
    }
  }

  if (loading) return <div className="admin-users-container"><p>Loading speakers...</p></div>;

  return (
    <div className="admin-users-container">
      <h1>Manage Speakers</h1>
      {error && <p className="error-text">{error}</p>}

      {speakers.length === 0 ? (
        <p>No speakers found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Topic</th>
              <th>Bio</th>
              <th>Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {speakers.map((s) => (
              <tr key={s.speakerId}>
                <td>{s.speakerId}</td>
                <td>{s.speakerName}</td>
                <td>{s.speakerTopic || "—"}</td>
                <td>{s.speakerBio || "—"}</td>
                <td>{s.event?.eventName || `Event #${s.eventId}`}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(s.speakerId, s.speakerName)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}