import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/Home.css";
import { Link } from "react-router-dom";

import event1 from "../assets/a.jpg";
import event2 from "../assets/p.jpg";
import event3 from "../assets/d.jpg";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await apiRequest("/Event/GetUpcomingEvents");
        setEvents(data.slice(0, 3));
      } catch (err) {
        setError("Couldn't load events right now.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const [eventsCount, setEventsCount] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [organizersCount, setOrganizersCount] = useState(0);

  useEffect(() => {
    let ev = 0;
    let participants = 0;
    let organizers = 0;

    const interval = setInterval(() => {
      ev += 1;
      participants += 40;
      organizers += 2;

      if (ev >= 50) ev = 50;
      if (participants >= 2000) participants = 2000;
      if (organizers >= 100) organizers = 100;

      setEventsCount(ev);
      setParticipantsCount(participants);
      setOrganizersCount(organizers);

      if (ev === 50 && participants === 2000 && organizers === 100) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <section className="hero-banner">
        <div className="banner-slider">
          <img src={event1} alt="Tech Hackathon" className="banner-image image1" />
          <img src={event2} alt="Cultural Festival" className="banner-image image2" />
          <img src={event3} alt="AI Workshop" className="banner-image image3" />
        </div>

        <div className="hero-overlay">
          <h1>Discover Amazing Events</h1>
          <p>
            Find, book, and enjoy unforgettable events. Connect with people
            and create amazing experiences.
          </p>
          <div className="hero-buttons">
            <Link to="/events">
              <button>Browse Events</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="events-section">
        <h2>Upcoming Events</h2>

        {loading && <p className="text-center">Loading events...</p>}
        {error && <p className="text-center">{error}</p>}

        <div className="event-cards">
          {events.map((event) => (
            <div className="event-card" key={event.eventId}>
              <h3>{event.eventName}</h3>
              <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
              <p>📍 {event.venue?.venueName || "Location TBA"}</p>
              <p>{event.eventDescription}</p>
              <Link to={`/events/${event.eventId}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="categories-section">
        <h2>Event Categories</h2>
        <div className="category-cards">
          <div className="category-card">
            <h3>💻 Technology</h3>
            <p>Hackathons, workshops, and tech events.</p>
          </div>
          <div className="category-card">
            <h3>🎭 Cultural</h3>
            <p>Music, art, and cultural activities.</p>
          </div>
          <div className="category-card">
            <h3>⚽ Sports</h3>
            <p>Tournaments and sports activities.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2>Our Community</h2>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{eventsCount}+</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{participantsCount}+</span>
            <span className="stat-label">Participants</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{organizersCount}+</span>
            <span className="stat-label">Organizers</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;