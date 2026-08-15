import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Events.css";

export default function Events() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/Event/GetEvents");
      setEvents(data);
    } catch (error) {
      setError(error.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await apiRequest(`/Event/DeleteEvent/${id}`, "DELETE");

      await loadEvents();
    } catch (error) {
      setError(error.message || "Failed to delete event.");
    }
  }

  if (loading) {
    return (
      <div className="events-page">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>Events</h1>
          <p>Browse and manage available events</p>
        </div>

        {(user?.role === "Organizer" || user?.role === "Admin") && (
          <Link to="/add-event" className="add-event-button">
            + Add Event
          </Link>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {events.length === 0 ? (
        <p className="empty-text">No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event, index) => (
            <div className="event-card" key={event.eventId || index}>
              <h2>{event.eventName}</h2>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.eventDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {event.eventStartTime} - {event.eventEndTime}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {event.eventDescription || "No description"}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {event.eventCategory?.eventCategoryName || "—"}
              </p>

              <p>
                <strong>Organizer:</strong>{" "}
                {event.organizerProfile?.companyName || "—"}
              </p>

              <p>
                <strong>Venue:</strong>{" "}
                {event.venue?.venueName || "—"}
              </p>

              <div className="event-actions">
                {/* Attend Event */}
                {event.eventId && user?.role === "Attendee" && (
                  <Link
                    to={`/tickets/${event.eventId}`}
                    className="attend-button"
                  >
                    Attend Event
                  </Link>
                )}

                {/* Leave a Review */}
                {event.eventId && user?.role === "Attendee" && (
                  <Link
                    to={`/reviews/${event.eventId}`}
                    className="review-button"
                  >
                    ⭐ Leave a Review
                  </Link>
                )}

                {/* Delete Event */}
                {(user?.role === "Organizer" ||
                  user?.role === "Admin") &&
                  event.eventId && (
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(event.eventId)}
                    >
                      Delete
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}