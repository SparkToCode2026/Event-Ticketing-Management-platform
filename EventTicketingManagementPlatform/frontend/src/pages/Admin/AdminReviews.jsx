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

    if (!minRating) return;

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
          r.reviewID === reviewId
            ? { ...r, rating: Number(newRating) }
            : r
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
      await apiRequest(
        `/Review/DeleteReview?id=${reviewId}`,
        "DELETE"
      );

      setReviews((prev) =>
        prev.filter((r) => r.reviewID !== reviewId)
      );
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="admin-users-container">

      <div className="admin-header">
        <div>
          <h1>Manage Reviews</h1>
          <p>View and manage all reviews on the platform.</p>
        </div>
      </div>

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {/* Filter */}
      <div className="admin-form-card">

        <form onSubmit={handleFilter}>

          <div className="input-group">
            <label htmlFor="minRating">
              Minimum Rating
            </label>

            <select
              id="minRating"
              value={minRating}
              onChange={(e) =>
                setMinRating(e.target.value)
              }
              required
            >
              <option value="">
                Select rating
              </option>

              {RATING_OPTIONS.map((rating) => (
                <option
                  key={rating}
                  value={rating}
                >
                  {rating}+
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="save-btn"
              disabled={filterLoading}
            >
              {filterLoading
                ? "Filtering..."
                : "Filter"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={handleClearFilter}
            >
              Clear
            </button>

          </div>

        </form>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <p className="loading-text">
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <p className="empty-text">
          No reviews found.
        </p>
      ) : (
        <div className="table-container">

          <table className="admin-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {reviews.map((review) => (

                <tr key={review.reviewID}>

                  <td>
                    {review.user?.userName ??
                      `User #${review.userId}`}
                  </td>

                  <td>
                    <select
                      value={review.rating}
                      disabled={
                        savingId === review.reviewID
                      }
                      onChange={(e) =>
                        handleRatingChange(
                          review.reviewID,
                          e.target.value
                        )
                      }
                    >
                      {RATING_OPTIONS.map((rating) => (
                        <option
                          key={rating}
                          value={rating}
                        >
                          {rating}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    {review.comment || "—"}
                  </td>

                  <td>
                    {review.reviewDate
                      ? new Date(
                          review.reviewDate
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      disabled={
                        savingId === review.reviewID
                      }
                      onClick={() =>
                        handleDelete(
                          review.reviewID
                        )
                      }
                    >
                      {savingId === review.reviewID
                        ? "..."
                        : "Delete"}
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}