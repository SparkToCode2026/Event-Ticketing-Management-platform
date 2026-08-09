import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/AddSpeaker.css";

export default function AddSpeaker() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [speakerName, setSpeakerName] = useState("");
  const [speakerBio, setSpeakerBio] = useState("");
  const [speakerTopic, setSpeakerTopic] = useState("");
  const [eventId, setEventId] = useState("");

  // 1. Fetch & Display all Speakers
  async function loadSpeakers() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/speaker/GetAllSpeakers");
      setSpeakers(data);
    } catch (err) {
      setError(err.message || "Failed to load speakers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSpeakers();
  }, []);

  // 2. Add & Update Speaker
  function handleAdd() {
    setEditingId(null);
    setSpeakerName("");
    setSpeakerBio("");
    setSpeakerTopic("");
    setEventId("");
    setShowForm(true);
  }

  function handleEdit(speaker) {
    setEditingId(speaker.speakerId);
    setSpeakerName(speaker.speakerName);
    setSpeakerBio(speaker.speakerBio || "");
    setSpeakerTopic(speaker.speakerTopic || "");
    setEventId(speaker.eventId);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      const speakerData = {
        speakerName,
        speakerBio,
        speakerTopic,
        eventId: Number(eventId),
      };

      if (editingId) {
        await apiRequest(
          `/speaker/UpdateSpeaker?id=${editingId}`,
          "PUT",
          speakerData
        );
      } else {
        await apiRequest(
          "/speaker/AddSpeaker",
          "POST",
          speakerData
        );
      }

      setShowForm(false);
      setEditingId(null);

      await loadSpeakers();
    } catch (err) {
      setError(err.message || "Failed to save speaker.");
    }
  }

  // 3. Delete Speaker
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this speaker?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await apiRequest(
        `/speaker/DeleteSpeaker?id=${id}`,
        "DELETE"
      );

      await loadSpeakers();
    } catch (err) {
      setError(err.message || "Failed to delete speaker.");
    }
  }

  return (
    <div className="speaker-management-card">

      <div className="speaker-header">
        <div>
          <h1>Speakers Management</h1>
          <p>Manage speakers for your events</p>
        </div>

        <button
          className="add-speaker-btn"
          onClick={handleAdd}
        >
          + Add Speaker
        </button>
      </div>

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {showForm && (
        <div className="speaker-form-card">

          <h2>
            {editingId ? "Edit Speaker" : "Add Speaker"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Speaker Name</label>

              <input
                type="text"
                value={speakerName}
                onChange={(e) =>
                  setSpeakerName(e.target.value)
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Speaker Bio</label>

              <textarea
                value={speakerBio}
                onChange={(e) =>
                  setSpeakerBio(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Speaker Topic</label>

              <input
                type="text"
                value={speakerTopic}
                onChange={(e) =>
                  setSpeakerTopic(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Event ID</label>

              <input
                type="number"
                value={eventId}
                onChange={(e) =>
                  setEventId(e.target.value)
                }
                required
              />
            </div>

            <div className="form-buttons">

              <button
                type="submit"
                className="save-btn"
              >
                {editingId
                  ? "Update Speaker"
                  : "Add Speaker"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-text">
          Loading speakers...
        </p>
      ) : speakers.length === 0 ? (
        <p className="empty-text">
          No speakers found.
        </p>
      ) : (
        <div className="table-container">

          <table className="speakers-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Topic</th>
                <th>Event</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {speakers.map((speaker) => (

                <tr key={speaker.speakerId}>

                  <td>
                    {speaker.speakerName}
                  </td>

                  <td>
                    {speaker.speakerTopic || "-"}
                  </td>

                  <td>
                    {speaker.event?.eventName ||
                      `Event #${speaker.eventId}`}
                  </td>

                  <td>
                    {speaker.speakerBio || "-"}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(speaker)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          speaker.speakerId
                        )
                      }
                    >
                      Delete
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