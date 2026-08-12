import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import "../styles/AdminUsers.css";

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyEvents();
  }, []);

  async function loadMyEvents() {
    setLoading(true);
    setError("");
    try {
      // Find this user's organizer profile
      const profiles = await apiRequest("/api/OrganizerProfile");
      const myProfile = profiles.find((p) => p.userId === user.userId);

      if (!myProfile) {
        setError("You don't have an organizer profile yet. Contact an Admin.");
        setEvents([]);
        return;
      }

      // Fetch all events, filter to only this organizer's
      const allEvents = await apiRequest("/Event/GetEvents");
      const myEvents = allEvents.filter((e) => e.organizerId === myProfile.organizerId);
      setEvents(myEvents);
    } catch (err) {
      setError(err.message || "Failed to load your events.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(eventId, eventName) {
    if (!confirm(`Delete event "${eventName}"? This cannot be undone.`)) return;

    try {
      await apiRequest(`/Event/DeleteEvent/${eventId}`, "DELETE");
      setEvents((prev) => prev.filter((e) => e.eventId !== eventId));
    } catch (err) {
      alert(err.message || "Failed to delete event.");
    }
  }

  if (loading) return <div className="admin-users-container"><p>Loading your events...</p></div>;

  return (
    <div className="admin-users-container">
      <h1>My Events</h1>
      {error && <p className="error-text">{error}</p>}

      {events.length === 0 && !error ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.eventId}>
                <td>{e.eventId}</td>
                <td>{e.eventName}</td>
                <td>{new Date(e.eventDate).toLocaleDateString()}</td>
                <td>{e.venue?.venueName || "—"}</td>
                <td>{e.eventCategory?.eventCategoryName || "—"}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(e.eventId, e.eventName)}>
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