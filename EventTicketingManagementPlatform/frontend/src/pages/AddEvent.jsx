import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "../styles/AddEvent.css";

export default function AddEvent() {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventCategoryId, setEventCategoryId] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [venueId, setVenueId] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await apiRequest("/Event/AddEvent", "POST", {
        eventName,
        eventDate,
        eventStartTime: `${eventStartTime}:00`,
        eventEndTime: `${eventEndTime}:00`,
        eventDescription,
        eventCategoryId: Number(eventCategoryId),
        organizerId: Number(organizerId),
        venueId: Number(venueId),
      });

      navigate("/events");
    } catch (error) {
      setError(error.message || "Failed to add event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="add-event-page">
      <div className="add-event-card">
        <h1>Add Event</h1>
        <p>Create a new event for ticket sales</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="eventName">Event Name</label>
            <input
              id="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="eventDate">Event Date</label>
            <input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="eventStartTime">Start Time</label>
            <input
              id="eventStartTime"
              type="time"
              value={eventStartTime}
              onChange={(e) => setEventStartTime(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="eventEndTime">End Time</label>
            <input
              id="eventEndTime"
              type="time"
              value={eventEndTime}
              onChange={(e) => setEventEndTime(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="eventDescription">Description</label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="eventCategoryId">Event Category ID</label>
            <input
              id="eventCategoryId"
              type="number"
              value={eventCategoryId}
              onChange={(e) => setEventCategoryId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="organizerId">Organizer ID</label>
            <input
              id="organizerId"
              type="number"
              value={organizerId}
              onChange={(e) => setOrganizerId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="venueId">Venue ID</label>
            <input
              id="venueId"
              type="number"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Adding event..." : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
}