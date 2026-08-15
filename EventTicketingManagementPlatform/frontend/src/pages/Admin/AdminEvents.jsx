// frontend/src/pages/admin/AdminEvents.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    eventName: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    eventDescription: "",
    eventCategoryId: "",
    organizerId: "",
    venueId: "",
  });
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/Event/GetEvents");
      setEvents(data);
    } catch (err) {
      setError(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await apiRequest("/Event/AddEvent", "POST", {
        eventName: form.eventName,
        eventDate: form.eventDate,
        eventStartTime: form.eventStartTime,
        eventEndTime: form.eventEndTime,
        eventDescription: form.eventDescription,
        eventCategoryId: Number(form.eventCategoryId),
        organizerId: Number(form.organizerId),
        venueId: Number(form.venueId),
      });
      setForm({
        eventName: "", eventDate: "", eventStartTime: "", eventEndTime: "",
        eventDescription: "", eventCategoryId: "", organizerId: "", venueId: "",
      });
      await loadEvents();
    } catch (err) {
      alert(err.message || "Failed to create event.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(ev) {
    setEditingId(ev.eventId);
    setEditValues({
      eventName: ev.eventName,
      eventDate: ev.eventDate?.slice(0, 10),
      eventStartTime: ev.eventStartTime,
      eventEndTime: ev.eventEndTime,
      eventDescription: ev.eventDescription || "",
      eventCategoryId: ev.eventCategoryId,
      organizerId: ev.organizerId,
      venueId: ev.venueId,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({});
  }

  async function handleSaveEdit(eventId) {
    setSaving(true);
    try {
      await apiRequest(`/Event/UpdateEvent/${eventId}`, "PUT", {
        eventName: editValues.eventName,
        eventDate: editValues.eventDate,
        eventStartTime: editValues.eventStartTime,
        eventEndTime: editValues.eventEndTime,
        eventDescription: editValues.eventDescription,
        eventCategoryId: Number(editValues.eventCategoryId),
        organizerId: Number(editValues.organizerId),
        venueId: Number(editValues.venueId),
      });
      await loadEvents();
      cancelEdit();
    } catch (err) {
      alert(err.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(eventId, name) {
    if (!confirm(`Delete event "${name}"? This cannot be undone.`)) return;
    try {
      await apiRequest(`/Event/DeleteEvent/${eventId}`, "DELETE");
      setEvents((prev) => prev.filter((e) => e.eventId !== eventId));
    } catch (err) {
      alert(err.message || "Failed to delete event.");
    }
  }

  const inputStyle = { padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea" };
  const editInputStyle = { padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea", width: "90px" };

  if (loading) return <div className="admin-users-container"><p>Loading events...</p></div>;

  return (
    <div className="admin-users-container">
      <h1>Manage Events</h1>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input type="text" placeholder="Event Name" value={form.eventName}
          onChange={(e) => setForm({ ...form, eventName: e.target.value })} style={{ ...inputStyle, minWidth: "160px" }} required />
        <input type="date" value={form.eventDate}
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })} style={inputStyle} required />
        <input type="time" value={form.eventStartTime}
          onChange={(e) => setForm({ ...form, eventStartTime: e.target.value })} style={inputStyle} required />
        <input type="time" value={form.eventEndTime}
          onChange={(e) => setForm({ ...form, eventEndTime: e.target.value })} style={inputStyle} required />
        <input type="text" placeholder="Description" value={form.eventDescription}
          onChange={(e) => setForm({ ...form, eventDescription: e.target.value })} style={{ ...inputStyle, minWidth: "180px", flex: 1 }} />
        <input type="number" placeholder="Category ID" value={form.eventCategoryId}
          onChange={(e) => setForm({ ...form, eventCategoryId: e.target.value })} style={{ ...inputStyle, width: "110px" }} required />
        <input type="number" placeholder="Organizer ID" value={form.organizerId}
          onChange={(e) => setForm({ ...form, organizerId: e.target.value })} style={{ ...inputStyle, width: "110px" }} required />
        <input type="number" placeholder="Venue ID" value={form.venueId}
          onChange={(e) => setForm({ ...form, venueId: e.target.value })} style={{ ...inputStyle, width: "100px" }} required />
        <button type="submit" disabled={creating} className="delete-btn" style={{ background: "#fde047", color: "#1e293b" }}>
          {creating ? "Creating..." : "Add Event"}
        </button>
      </form>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Category</th>
              <th>Organizer</th>
              <th>Venue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.eventId}>
                <td>{ev.eventId}</td>
                <td>
                  {editingId === ev.eventId ? (
                    <input type="text" value={editValues.eventName}
                      onChange={(e) => setEditValues((p) => ({ ...p, eventName: e.target.value }))}
                      style={editInputStyle} />
                  ) : ev.eventName}
                </td>
                <td>
                  {editingId === ev.eventId ? (
                    <input type="date" value={editValues.eventDate}
                      onChange={(e) => setEditValues((p) => ({ ...p, eventDate: e.target.value }))}
                      style={editInputStyle} />
                  ) : new Date(ev.eventDate).toLocaleDateString()}
                </td>
                <td>
                  {editingId === ev.eventId ? (
                    <div style={{ display: "flex", gap: "4px" }}>
                      <input type="time" value={editValues.eventStartTime}
                        onChange={(e) => setEditValues((p) => ({ ...p, eventStartTime: e.target.value }))}
                        style={editInputStyle} />
                      <input type="time" value={editValues.eventEndTime}
                        onChange={(e) => setEditValues((p) => ({ ...p, eventEndTime: e.target.value }))}
                        style={editInputStyle} />
                    </div>
                  ) : `${ev.eventStartTime} - ${ev.eventEndTime}`}
                </td>
                <td>
                  {editingId === ev.eventId ? (
                    <input type="number" value={editValues.eventCategoryId}
                      onChange={(e) => setEditValues((p) => ({ ...p, eventCategoryId: e.target.value }))}
                      style={editInputStyle} />
                  ) : (ev.eventCategory?.eventCategoryName || "—")}
                </td>
                <td>
                  {editingId === ev.eventId ? (
                    <input type="number" value={editValues.organizerId}
                      onChange={(e) => setEditValues((p) => ({ ...p, organizerId: e.target.value }))}
                      style={editInputStyle} />
                  ) : (ev.organizerProfile?.companyName || "—")}
                </td>
                <td>
                  {editingId === ev.eventId ? (
                    <input type="number" value={editValues.venueId}
                      onChange={(e) => setEditValues((p) => ({ ...p, venueId: e.target.value }))}
                      style={editInputStyle} />
                  ) : (ev.venue?.venueName || "—")}
                </td>
                <td>
                  {editingId === ev.eventId ? (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button disabled={saving} onClick={() => handleSaveEdit(ev.eventId)} className="delete-btn" style={{ background: "#dcfce7", color: "#166534" }}>
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={cancelEdit} className="delete-btn" style={{ background: "#e2e8f0", color: "#1e293b" }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => startEdit(ev)} className="delete-btn" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(ev.eventId, ev.eventName)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}