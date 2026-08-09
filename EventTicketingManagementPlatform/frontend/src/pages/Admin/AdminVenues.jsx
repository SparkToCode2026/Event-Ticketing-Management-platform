import { useEffect, useState } from "react";


function fakeApiRequest(action, payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), 400); 
  });
}

export default function AdminVenuesDemo() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fakeApiRequest("load", []).then((data) => {
      setVenues(data);
      setLoading(false);
    });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName || !newAddress) return;

    setCreating(true);
    const newItem = {
      venue_Id: Math.max(0, ...venues.map((v) => v.venue_Id)) + 1,
      name: newName,
      address: newAddress,
      events: [],
    };
    await fakeApiRequest("create", newItem);
    setVenues((prev) => [...prev, newItem]);
    setNewName("");
    setNewAddress("");
    setCreating(false);
  }

  function startEdit(venue) {
    setEditingId(venue.venue_Id);
    setEditValues({ name: venue.name, address: venue.address });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({ name: "", address: "" });
  }

  async function handleSaveEdit(venueId) {
    setSaving(true);
    await fakeApiRequest("update", editValues);
    setVenues((prev) =>
        prev.map((v) => (v.venue_Id === venueId ? { ...v, ...editValues } : v))
    );
    setSaving(false);
    cancelEdit();
  }

  async function handleDelete(venueId, name) {
    if (!window.confirm(`Delete venue "${name}"? This cannot be undone.`)) return;
    await fakeApiRequest("delete", { venueId });
    setVenues((prev) => prev.filter((v) => v.venue_Id !== venueId));
  }

  const inputStyle = { padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea" };
  const editInputStyle = { padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea" };
  const btnBase = { border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 600 };

  if (loading) {
    return (
        <div style={{ padding: "32px", fontFamily: "system-ui, sans-serif" }}>
          <p>Loading venues...</p>
        </div>
    );
  }

  return (
      <div style={{ padding: "32px", fontFamily: "system-ui, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "4px" }}>Manage Venues</h1>
        <p style={{ color: "#64748b", marginTop: 0, marginBottom: "20px", fontSize: "14px" }}>
          Demo preview — data is local and resets on refresh.
        </p>

        <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input type="text" placeholder="Venue Name" value={newName}
                 onChange={(e) => setNewName(e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Address" value={newAddress}
                 onChange={(e) => setNewAddress(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: "180px" }} />
          <button type="submit" disabled={creating}
                  style={{ ...btnBase, background: "#fde047", color: "#1e293b" }}>
            {creating ? "Creating..." : "Create Venue"}
          </button>
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
            <th style={{ padding: "8px" }}>ID</th>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Address</th>
            <th style={{ padding: "8px" }}>Events</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {venues.map((v) => (
              <tr key={v.venue_Id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "8px" }}>{v.venue_Id}</td>
                <td style={{ padding: "8px" }}>
                  {editingId === v.venue_Id ? (
                      <input type="text" value={editValues.name}
                             onChange={(e) => setEditValues((p) => ({ ...p, name: e.target.value }))}
                             style={editInputStyle} />
                  ) : v.name}
                </td>
                <td style={{ padding: "8px" }}>
                  {editingId === v.venue_Id ? (
                      <input type="text" value={editValues.address}
                             onChange={(e) => setEditValues((p) => ({ ...p, address: e.target.value }))}
                             style={editInputStyle} />
                  ) : v.address}
                </td>
                <td style={{ padding: "8px" }}>{v.events?.length ?? 0}</td>
                <td style={{ padding: "8px" }}>
                  {editingId === v.venue_Id ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button disabled={saving} onClick={() => handleSaveEdit(v.venue_Id)}
                                style={{ ...btnBase, background: "#dcfce7", color: "#166534" }}>
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button onClick={cancelEdit}
                                style={{ ...btnBase, background: "#e2e8f0", color: "#1e293b" }}>
                          Cancel
                        </button>
                      </div>
                  ) : (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => startEdit(v)}
                                style={{ ...btnBase, background: "#e0f2fe", color: "#0369a1" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(v.venue_Id, v.name)}
                                style={{ ...btnBase, background: "#fee2e2", color: "#991b1b" }}>
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
  );
}