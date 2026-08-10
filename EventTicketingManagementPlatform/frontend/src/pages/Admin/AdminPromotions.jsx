// frontend/src/pages/admin/AdminPromotions.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [orderId, setOrderId] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [promotionType, setPromotionType] = useState("");
  const [promotionStartDate, setPromotionStartDate] = useState("");
  const [promotionExpiry, setPromotionExpiry] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    loadPromotions();
  }, []);

  async function loadPromotions() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/Promotion/list");
      setPromotions(data);
    } catch (err) {
      setError(err.message || "Failed to load promotions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPromotion(e) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    try {
      await apiRequest(
        `/Promotion/AddPromotion?orderId=${Number(orderId)}`,
        "POST",
        {
          promotionCode,
          promotionType,
          promotionStartDate,
          promotionExpiry,
        }
      );

      setFormSuccess("Promotion added successfully!");
      setOrderId("");
      setPromotionCode("");
      setPromotionType("");
      setPromotionStartDate("");
      setPromotionExpiry("");
      loadPromotions();
    } catch (err) {
      setFormError(err.message || "Failed to add promotion.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleExpiryChange(promotionId, newExpiry) {
    setSavingId(promotionId);
    try {
      await apiRequest(
        `/Promotion/UpdateExpiryDate?id=${promotionId}&expiryDate=${newExpiry}`,
        "PATCH"
      );
      setPromotions((prev) =>
        prev.map((p) =>
          p.promotionId === promotionId
            ? { ...p, promotionExpiry: newExpiry }
            : p
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update expiry date.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(promotionId) {
    if (!window.confirm("Delete this promotion?")) return;

    setSavingId(promotionId);
    try {
      await apiRequest(`/Promotion/DeletePromotion?id=${promotionId}`, "DELETE");
      setPromotions((prev) => prev.filter((p) => p.promotionId !== promotionId));
    } catch (err) {
      alert(err.message || "Failed to delete promotion.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="admin-page">
      <h1>Manage Promotions</h1>

      <div className="admin-form-card">
        <h2>Add New Promotion</h2>

        {formError && <p className="error-text">{formError}</p>}
        {formSuccess && <p className="success-text">{formSuccess}</p>}

        <form onSubmit={handleAddPromotion} className="admin-form">
          <label htmlFor="orderId">Order ID</label>
          <input
            id="orderId"
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />

          <label htmlFor="promotionCode">Promotion Code</label>
          <input
            id="promotionCode"
            type="text"
            value={promotionCode}
            onChange={(e) => setPromotionCode(e.target.value)}
            required
          />

          <label htmlFor="promotionType">Promotion Type</label>
          <input
            id="promotionType"
            type="text"
            value={promotionType}
            onChange={(e) => setPromotionType(e.target.value)}
            required
          />

          <label htmlFor="promotionStartDate">Start Date</label>
          <input
            id="promotionStartDate"
            type="date"
            value={promotionStartDate}
            onChange={(e) => setPromotionStartDate(e.target.value)}
            required
          />

          <label htmlFor="promotionExpiry">Expiry Date</label>
          <input
            id="promotionExpiry"
            type="date"
            value={promotionExpiry}
            onChange={(e) => setPromotionExpiry(e.target.value)}
            required
          />

          <button type="submit" disabled={formLoading}>
            {formLoading ? "Adding..." : "Add Promotion"}
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading promotions...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : promotions.length === 0 ? (
        <p>No promotions found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>Expiry</th>
              <th>Orders</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.promotionId}>
                <td>{promo.promotionCode}</td>
                <td>{promo.promotionType}</td>
                <td>
                  {new Date(promo.promotionStartDate).toLocaleDateString()}
                </td>
                <td>
                  <input
                    type="date"
                    defaultValue={promo.promotionExpiry?.slice(0, 10)}
                    disabled={savingId === promo.promotionId}
                    onChange={(e) =>
                      handleExpiryChange(promo.promotionId, e.target.value)
                    }
                  />
                </td>
                <td>{promo.orders?.length ?? 0}</td>
                <td>
                  <button
                    className="delete-btn"
                    disabled={savingId === promo.promotionId}
                    onClick={() => handleDelete(promo.promotionId)}
                  >
                    {savingId === promo.promotionId ? "..." : "Delete"}
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
