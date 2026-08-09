// frontend/src/pages/admin/AdminPayments.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

const STATUS_OPTIONS = ["Completed", "Pending", "Failed", "Refunded"];

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/Payment/GetAllPayments");
      setPayments(data);
    } catch (err) {
      setError(err.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(paymentId, newStatus) {
    setSavingId(paymentId);
    try {
      await apiRequest(`/Payment/UpdatePaymentStatus?id=${paymentId}`, "PATCH", newStatus);
      setPayments((prev) =>
        prev.map((p) => (p.paymentId === paymentId ? { ...p, paymentStatus: newStatus } : p))
      );
    } catch (err) {
      alert(err.message || "Failed to update status.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(paymentId) {
    if (!confirm(`Delete payment #${paymentId}? This cannot be undone.`)) return;

    try {
      await apiRequest(`/Payment/DeletePayment?id=${paymentId}`, "DELETE");
      setPayments((prev) => prev.filter((p) => p.paymentId !== paymentId));
    } catch (err) {
      alert(err.message || "Failed to delete payment.");
    }
  }

  if (loading) return <div className="admin-users-container"><p>Loading payments...</p></div>;

  return (
    <div className="admin-users-container">
      <h1>Manage Payments</h1>
      {error && <p className="error-text">{error}</p>}

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.paymentId}>
                <td>{p.paymentId}</td>
                <td>{p.orderId}</td>
                <td>{p.paymentMethod}</td>
                <td>{p.paymentAmount?.toFixed(2)} OMR</td>
                <td>
                  <select
                    value={p.paymentStatus}
                    disabled={savingId === p.paymentId}
                    onChange={(e) => handleStatusChange(p.paymentId, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(p.paymentId)}>
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