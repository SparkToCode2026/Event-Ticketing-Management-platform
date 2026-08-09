import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import "../styles/EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/Event/GetEventById/${id}`);
      setEvent(data);
    } catch (error) {
      setError(error.message || "Failed to load event details.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="event-details-page">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-page">
        <p className="error-text">{error}</p>
        <Link to="/events" className="back-button">
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <p>Event not found.</p>
        <Link to="/events" className="back-button">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-details-card">
        <h1>{event.eventName}</h1>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(event.eventDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Start Time:</strong> {event.eventStartTime}
        </p>

        <p>
          <strong>End Time:</strong> {event.eventEndTime}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {event.eventDescription || "No description"}
        </p>

        <p>
          <strong>Category ID:</strong> {event.eventCategoryId}
        </p>

        <p>
          <strong>Organizer ID:</strong> {event.organizerId}
        </p>

        <p>
          <strong>Venue ID:</strong> {event.venueId}
        </p>

        <div className="details-actions">
          <Link to={`/tickets/${id}`} className="tickets-button">
            Buy Tickets
          </Link>

          <Link to="/events" className="back-button">
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}