
import { useState } from "react";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/AddReview.css";

const RATING_OPTIONS = [1, 2, 3, 4, 5];


export default function AddReview({ eventId, onReviewAdded }) {
  const { user } = useAuth();

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to leave a review.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/Review/AddReview", "POST", {
        rating: Number(rating),
        comment,
        userId: user.userId,
        eventId: Number(eventId),
      });

      setSuccess("Thanks for your review!");
      setRating("");
      setComment("");
      onReviewAdded?.();
    } catch (err) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-review-card">
      <h3>Leave a Review</h3>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form onSubmit={handleSubmit} className="add-review-form">
        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        >
          <option value="">Select a rating</option>
          {RATING_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r} {r === 1 ? "star" : "stars"}
            </option>
          ))}
        </select>

        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={4}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
