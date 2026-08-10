import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import "../styles/Events.css";

export default function Events() {
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
    const confirmed = window.confirm("Are you sure you want to delete this event?");
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

        <Link to="/add-event" className="add-event-button">
          + Add Event
        </Link>
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
                <strong>Time:</strong> {event.eventStartTime} -{" "}
                {event.eventEndTime}
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

              <div className="event-actions">
                {event.eventId && (
                  <Link
                    to={`/events/${event.eventId}`}
                    className="details-button"
                  >
                    Details
                  </Link>
                )}

                {event.eventId && (
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