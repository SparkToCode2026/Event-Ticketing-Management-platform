import { useEffect, useState } from "react";


function fakeApiRequest(action, payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), 400);
  });
}

export default function AdminTicketTypesDemo() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTicketId, setNewTicketId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newBenefits, setNewBenefits] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ category: "", price: "", benefits: "", ticketId: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fakeApiRequest("load", []).then((data) => {
      setTicketTypes(data);
      setLoading(false);
    });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTicketId || !newCategory || !newPrice) return;

    setCreating(true);
    const newItem = {
      ticketTypeId: Math.max(0, ...ticketTypes.map((t) => t.ticketTypeId)) + 1,
      category: newCategory,
      price: Number(newPrice),
      benefits: newBenefits,
      ticketId: Number(newTicketId),
    };
    await fakeApiRequest("create", newItem);
    setTicketTypes((prev) => [...prev, newItem]);
    setNewTicketId("");
    setNewCategory("");
    setNewPrice("");
    setNewBenefits("");
    setCreating(false);
  }

  function startEdit(tt) {
    setEditingId(tt.ticketTypeId);
    setEditValues({
      category: tt.category,
      price: tt.price,
      benefits: tt.benefits,
      ticketId: tt.ticketId,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({ category: "", price: "", benefits: "", ticketId: "" });
  }

  async function handleSaveEdit(ticketTypeId) {
    setSaving(true);
    await fakeApiRequest("update", editValues);
    setTicketTypes((prev) =>
        prev.map((tt) =>
            tt.ticketTypeId === ticketTypeId
                ? {
                  ...tt,
                  category: editValues.category,
                  price: Number(editValues.price),
                  benefits: editValues.benefits,
                  ticketId: Number(editValues.ticketId),
                }
                : tt
        )
    );
    setSaving(false);
    cancelEdit();
  }

  async function handleDelete(ticketTypeId, category) {
    if (!window.confirm(`Delete ticket type "${category}"? This cannot be undone.`)) return;
    await fakeApiRequest("delete", { ticketTypeId });
    setTicketTypes((prev) => prev.filter((tt) => tt.ticketTypeId !== ticketTypeId));
  }

  const inputStyle = { padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea" };
  const editInputStyle = { padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea" };
  const btnBase = { border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", fontWeight: 600 };

  if (loading) {
    return (
        <div style={{ padding: "32px", fontFamily: "system-ui, sans-serif" }}>
          <p>Loading ticket types...</p>
        </div>
    );
  }

  return (
      <div style={{ padding: "32px", fontFamily: "system-ui, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "4px" }}>Manage Ticket Types</h1>
        <p style={{ color: "#64748b", marginTop: 0, marginBottom: "20px", fontSize: "14px" }}>
          Demo preview — data is local and resets on refresh.
        </p>

        <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input type="number" placeholder="Ticket ID" value={newTicketId}
                 onChange={(e) => setNewTicketId(e.target.value)} style={{ ...inputStyle, width: "110px" }} />
          <input type="text" placeholder="Category (e.g. VIP)" value={newCategory}
                 onChange={(e) => setNewCategory(e.target.value)} style={inputStyle} />
          <input type="number" step="0.01" placeholder="Price" value={newPrice}
                 onChange={(e) => setNewPrice(e.target.value)} style={{ ...inputStyle, width: "110px" }} />
          <input type="text" placeholder="Benefits" value={newBenefits}
                 onChange={(e) => setNewBenefits(e.target.value)} style={{ ...inputStyle, flex: 1, minWidth: "160px" }} />
          <button type="submit" disabled={creating}
                  style={{ ...btnBase, background: "#fde047", color: "#1e293b" }}>
            {creating ? "Creating..." : "Create Ticket Type"}
          </button>
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
            <th style={{ padding: "8px" }}>ID</th>
            <th style={{ padding: "8px" }}>Category</th>
            <th style={{ padding: "8px" }}>Price</th>
            <th style={{ padding: "8px" }}>Benefits</th>
            <th style={{ padding: "8px" }}>Ticket ID</th>
            <th style={{ padding: "8px" }}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {ticketTypes.map((tt) => (
              <tr key={tt.ticketTypeId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "8px" }}>{tt.ticketTypeId}</td>
                <td style={{ padding: "8px" }}>
                  {editingId === tt.ticketTypeId ? (
                      <input type="text" value={editValues.category}
                             onChange={(e) => setEditValues((p) => ({ ...p, category: e.target.value }))}
                             style={editInputStyle} />
                  ) : tt.category}
                </td>
                <td style={{ padding: "8px" }}>
                  {editingId === tt.ticketTypeId ? (
                      <input type="number" step="0.01" value={editValues.price}
                             onChange={(e) => setEditValues((p) => ({ ...p, price: e.target.value }))}
                             style={{ ...editInputStyle, width: "90px" }} />
                  ) : `$${tt.price}`}
                </td>
                <td style={{ padding: "8px" }}>
                  {editingId === tt.ticketTypeId ? (
                      <input type="text" value={editValues.benefits}
                             onChange={(e) => setEditValues((p) => ({ ...p, benefits: e.target.value }))}
                             style={editInputStyle} />
                  ) : tt.benefits}
                </td>
                <td style={{ padding: "8px" }}>
                  {editingId === tt.ticketTypeId ? (
                      <input type="number" value={editValues.ticketId}
                             onChange={(e) => setEditValues((p) => ({ ...p, ticketId: e.target.value }))}
                             style={{ ...editInputStyle, width: "90px" }} />
                  ) : tt.ticketId}
                </td>
                <td style={{ padding: "8px" }}>
                  {editingId === tt.ticketTypeId ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button disabled={saving} onClick={() => handleSaveEdit(tt.ticketTypeId)}
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
                        <button onClick={() => startEdit(tt)}
                                style={{ ...btnBase, background: "#e0f2fe", color: "#0369a1" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(tt.ticketTypeId, tt.category)}
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