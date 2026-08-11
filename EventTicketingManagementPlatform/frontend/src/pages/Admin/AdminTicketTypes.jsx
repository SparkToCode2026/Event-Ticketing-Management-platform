// frontend/src/pages/admin/AdminTicketTypes.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

export default function AdminTicketTypes() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newBenefits, setNewBenefits] = useState("");
  const [newEventId, setNewEventId] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ category: "", price: "", benefits: "", eventId: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [ticketData, eventData] = await Promise.all([
        apiRequest("/api/TicketType"),
        apiRequest("/Event/GetEvents"),
      ]);
      setTicketTypes(ticketData);

      const eventMap = {};
      eventData.forEach((e) => {
        eventMap[e.eventId] = e.eventName;
      });
      setEvents(eventMap);
    } catch (err) {
      setError(err.message || "Failed to load ticket types.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newCategory || !newPrice || !newEventId) return;

    setCreating(true);
    try {
      await apiRequest("/api/TicketType", "POST", {
        category: newCategory,
        price: Number(newPrice),
        benefits: newBenefits,
        eventId: Number(newEventId),
      });
      setNewCategory("");
      setNewPrice("");
      setNewBenefits("");
      setNewEventId("");
      await loadData();
    } catch (err) {
      alert(err.message || "Failed to create ticket type.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(tt) {
    setEditingId(tt.ticketTypeId);
    setEditValues({
      category: tt.category,
      price: tt.price,
      benefits: tt.benefits || "",
      eventId: tt.eventId,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({ category: "", price: "", benefits: "", eventId: "" });
  }

  async function handleSaveEdit(ticketTypeId) {
    setSaving(true);
    try {
      await apiRequest(`/api/TicketType/${ticketTypeId}`, "PUT", {
        ticketTypeId,
        category: editValues.category,
        price: Number(editValues.price),
        benefits: editValues.benefits,
        eventId: Number(editValues.eventId),
      });
      await loadData();
      cancelEdit();
    } catch (err) {
      alert(err.message || "Failed to update ticket type.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(ticketTypeId, category) {
    if (!confirm(`Delete ticket type "${category}"? This cannot be undone.`)) return;
    try {
      await apiRequest(`/api/TicketType/${ticketTypeId}`, "DELETE");
      setTicketTypes((prev) => prev.filter((tt) => tt.ticketTypeId !== ticketTypeId));
    } catch (err) {
      alert(err.message || "Failed to delete ticket type.");
    }
  }

  if (loading) return <div className="admin-users-container"><p>Loading ticket types...</p></div>;

  // Group ticket types by eventId
  const grouped = ticketTypes.reduce((acc, tt) => {
    if (!acc[tt.eventId]) acc[tt.eventId] = [];
    acc[tt.eventId].push(tt);
    return acc;
  }, {});

  return (
    <div className="admin-users-container">
      <h1>Manage Ticket Types</h1>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input type="text" placeholder="Category (e.g. VIP)" value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea" }} />
        <input type="number" step="0.01" placeholder="Price" value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea", width: "110px" }} />
        <input type="text" placeholder="Benefits" value={newBenefits}
          onChange={(e) => setNewBenefits(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea", flex: 1, minWidth: "160px" }} />
        <input type="number" placeholder="Event ID" value={newEventId}
          onChange={(e) => setNewEventId(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea", width: "110px" }} />
        <button type="submit" disabled={creating} className="delete-btn" style={{ background: "#fde047", color: "#1e293b" }}>
          {creating ? "Creating..." : "Create Ticket Type"}
        </button>
      </form>

      {Object.keys(grouped).length === 0 ? (
        <p>No ticket types found.</p>
      ) : (
        Object.entries(grouped).map(([eventId, items]) => (
          <div key={eventId} style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "18px", color: "#1e293b", marginBottom: "12px" }}>
              {events[eventId] || `Event #${eventId}`} <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Event ID: {eventId})</span>
            </h2>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Benefits</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((tt) => (
                  <tr key={tt.ticketTypeId}>
                    <td>{tt.ticketTypeId}</td>
                    <td>
                      {editingId === tt.ticketTypeId ? (
                        <input type="text" value={editValues.category}
                          onChange={(e) => setEditValues((p) => ({ ...p, category: e.target.value }))}
                          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea" }} />
                      ) : tt.category}
                    </td>
                    <td>
                      {editingId === tt.ticketTypeId ? (
                        <input type="number" step="0.01" value={editValues.price}
                          onChange={(e) => setEditValues((p) => ({ ...p, price: e.target.value }))}
                          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea", width: "90px" }} />
                      ) : `${tt.price} OMR`}
                    </td>
                    <td>
                      {editingId === tt.ticketTypeId ? (
                        <input type="text" value={editValues.benefits}
                          onChange={(e) => setEditValues((p) => ({ ...p, benefits: e.target.value }))}
                          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea" }} />
                      ) : (tt.benefits || "—")}
                    </td>
                    <td>
                      {editingId === tt.ticketTypeId ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button disabled={saving} onClick={() => handleSaveEdit(tt.ticketTypeId)} className="delete-btn" style={{ background: "#dcfce7", color: "#166534" }}>
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button onClick={cancelEdit} className="delete-btn" style={{ background: "#e2e8f0", color: "#1e293b" }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => startEdit(tt)} className="delete-btn" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(tt.ticketTypeId, tt.category)} className="delete-btn">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}