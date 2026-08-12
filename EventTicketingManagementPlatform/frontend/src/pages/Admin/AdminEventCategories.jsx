// frontend/src/pages/admin/AdminEventCategories.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

export default function AdminEventCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/EventCategory/GetAllEventCategories");
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load event categories.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName) return;

    setCreating(true);
    try {
      await apiRequest("/EventCategory/AddEventCategory", "POST", {
        eventCategoryName: newName,
        eventCategoryDescription: newDescription,
      });
      setNewName("");
      setNewDescription("");
      await loadCategories();
    } catch (err) {
      alert(err.message || "Failed to create category.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(cat) {
    setEditingId(cat.eventCategoryId);
    setEditValues({
      name: cat.eventCategoryName,
      description: cat.eventCategoryDescription || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({ name: "", description: "" });
  }

  async function handleSaveEdit(id) {
    setSaving(true);
    try {
      await apiRequest(`/EventCategory/UpdateEventCategory/${id}`, "PUT", {
        eventCategoryName: editValues.name,
        eventCategoryDescription: editValues.description,
      });
      await loadCategories();
      cancelEdit();
    } catch (err) {
      alert(err.message || "Failed to update category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      await apiRequest(`/EventCategory/DeleteEventCategory/${id}`, "DELETE");
      setCategories((prev) => prev.filter((c) => c.eventCategoryId !== id));
    } catch (err) {
      alert(err.message || "Failed to delete category.");
    }
  }

  if (loading) return <div className="admin-users-container"><p>Loading event categories...</p></div>;

  return (
    <div className="admin-users-container">
      <h1>Manage Event Categories</h1>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Category Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #dbe1ea", flex: 1, minWidth: "200px" }}
        />
        <button type="submit" disabled={creating} className="delete-btn" style={{ background: "#fde047", color: "#1e293b" }}>
          {creating ? "Creating..." : "Create Category"}
        </button>
      </form>

      {categories.length === 0 ? (
        <p>No event categories found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Events</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.eventCategoryId}>
                <td>{c.eventCategoryId}</td>
                <td>
                  {editingId === c.eventCategoryId ? (
                    <input
                      type="text"
                      value={editValues.name}
                      onChange={(e) => setEditValues((p) => ({ ...p, name: e.target.value }))}
                      style={{ padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea" }}
                    />
                  ) : c.eventCategoryName}
                </td>
                <td>
                  {editingId === c.eventCategoryId ? (
                    <input
                      type="text"
                      value={editValues.description}
                      onChange={(e) => setEditValues((p) => ({ ...p, description: e.target.value }))}
                      style={{ padding: "6px", borderRadius: "6px", border: "1px solid #dbe1ea" }}
                    />
                  ) : (c.eventCategoryDescription || "—")}
                </td>
                <td>{c.events?.length ?? 0}</td>
                <td>
                  {editingId === c.eventCategoryId ? (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button disabled={saving} onClick={() => handleSaveEdit(c.eventCategoryId)} className="delete-btn" style={{ background: "#dcfce7", color: "#166534" }}>
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={cancelEdit} className="delete-btn" style={{ background: "#e2e8f0", color: "#1e293b" }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => startEdit(c)} className="delete-btn" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(c.eventCategoryId, c.eventCategoryName)} className="delete-btn">
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