// frontend/src/pages/admin/AdminReviews.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../../styles/AdminUsers.css";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [minRating, setMinRating] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/Review/List");
      setReviews(data);
    } catch (err) {
      setError(err.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFilter(e) {
    e.preventDefault();
    setError("");
    setFilterLoading(true);

    try {
      const data = await apiRequest(
        `/Review/FilterReviews?minRating=${Number(minRating)}`
      );
      setReviews(data);
    } catch (err) {
      setError(err.message || "Failed to filter reviews.");
    } finally {
      setFilterLoading(false);
    }
  }

  function handleClearFilter() {
    setMinRating("");
    loadReviews();
  }

  async function handleRatingChange(reviewId, newRating) {
    setSavingId(reviewId);
    try {
      await apiRequest(
        `/Review/UpdateRating?id=${reviewId}&rating=${newRating}`,
        "PATCH"
      );
      setReviews((prev) =>
        prev.map((r) =>
          r.reviewID === reviewId ? { ...r, rating: Number(newRating) } : r
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update rating.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(reviewId) {
    if (!window.confirm("Delete this review?")) return;

    setSavingId(reviewId);
    try {
      await apiRequest(`/Review/DeleteReview?id=${reviewId}`, "DELETE");
      setReviews((prev) => prev.filter((r) => r.reviewID !== reviewId));
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="admin-page">
      <h1>Manage Reviews</h1>

      <div className="admin-form-card">
        <h2>Filter by Minimum Rating</h2>

        <form onSubmit={handleFilter} className="admin-form">
          <label htmlFor="minRating">Minimum Rating</label>
          <select
            id="minRating"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            required
          >
            <option value="">Select rating</option>
            {RATING_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}+
              </option>
            ))}
          </select>

          <button type="submit" disabled={filterLoading}>
            {filterLoading ? "Filtering..." : "Filter"}
          </button>
          <button type="button" onClick={handleClearFilter}>
            Clear
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.reviewID}>
                <td>{review.user?.userName ?? `User #${review.userId}`}</td>
                <td>
                  <select
                    value={review.rating}
                    disabled={savingId === review.reviewID}
                    onChange={(e) =>
                      handleRatingChange(review.reviewID, e.target.value)
                    }
                  >
                    {RATING_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{review.comment}</td>
                <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    disabled={savingId === review.reviewID}
                    onClick={() => handleDelete(review.reviewID)}
                  >
                    {savingId === review.reviewID ? "..." : "Delete"}
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
