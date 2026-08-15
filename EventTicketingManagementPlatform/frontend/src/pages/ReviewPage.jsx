import { useParams, Link } from "react-router-dom";
import AddReview from "./AddReview";
import "../styles/ReviewPage.css";
import pic from "../assets/pic.jpg";

export default function ReviewPage() {
  const { eventId } = useParams();

  return (
    <div
      className="review-page"
      style={{
        backgroundImage: `url(${pic})`,
      }}
    >
      <div className="review-overlay">

        <div className="review-container">

          <Link to="/events" className="back-link">
            ← Back to Events
          </Link>

          <div className="review-card">

            <div className="review-header">
              <div className="review-icon">⭐</div>

              <h1>Leave a Review</h1>

              <p>
                Share your experience and help others discover great events.
              </p>
            </div>

            <AddReview eventId={eventId} />

          </div>

        </div>

      </div>
    </div>
  );
}