import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [promotionCode, setPromotionCode] = useState("");
  const [promotionType, setPromotionType] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
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
      await apiRequest("/Promotion/AddPromotion", "POST", {
        promotionCode,
        promotionType,
        discountAmount: Number(discountAmount),
        promotionStartDate,
        promotionExpiry,
      });

      setFormSuccess("Promotion added successfully!");

      setPromotionCode("");
      setPromotionType("");
      setDiscountAmount("");
      setPromotionStartDate("");
      setPromotionExpiry("");

      await loadPromotions();
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

  if (loading) {
    return (
      <div className="admin-users-container">
        <p>Loading promotions...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-container">

      <div className="admin-header">
        <div>
          <h1>Manage Promotions</h1>
          <p>Manage discount codes and promotion expiry dates. Applies to any event/order.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="admin-form-card">

        <h2>Add New Promotion</h2>

        {formError && <p className="error-text">{formError}</p>}
        {formSuccess && <p className="success-text">{formSuccess}</p>}

        <form onSubmit={handleAddPromotion}>

          <div className="input-group">
            <label>Promotion Code</label>
            <input
              type="text"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value)}
              placeholder="e.g. SPARK"
              required
            />
          </div>

          <div className="input-group">
            <label>Promotion Type</label>
            <input
              type="text"
              value={promotionType}
              onChange={(e) => setPromotionType(e.target.value)}
              placeholder="e.g. Fixed"
              required
            />
          </div>

          <div className="input-group">
            <label>Discount Amount (OMR)</label>
            <input
              type="number"
              step="0.01"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder="e.g. 5"
              required
            />
          </div>

          <div className="input-group">
            <label>Start Date</label>
            <input
              type="date"
              value={promotionStartDate}
              onChange={(e) => setPromotionStartDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={promotionExpiry}
              onChange={(e) => setPromotionExpiry(e.target.value)}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn" disabled={formLoading}>
              {formLoading ? "Adding..." : "Add Promotion"}
            </button>
          </div>

        </form>
      </div>

      <div className="table-container">

        {promotions.length === 0 ? (
          <p className="empty-text">No promotions found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Start Date</th>
                <th>Expiry</th>
                <th>Orders Used</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.promotionId}>
                  <td>{promo.promotionId}</td>
                  <td>{promo.promotionCode}</td>
                  <td>{promo.promotionType}</td>
                  <td>{promo.discountAmount} OMR</td>
                  <td>
                    {promo.promotionStartDate
                      ? new Date(promo.promotionStartDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <input
                      type="date"
                      value={promo.promotionExpiry ? promo.promotionExpiry.slice(0, 10) : ""}
                      disabled={savingId === promo.promotionId}
                      onChange={(e) => handleExpiryChange(promo.promotionId, e.target.value)}
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

    </div>
  );
}