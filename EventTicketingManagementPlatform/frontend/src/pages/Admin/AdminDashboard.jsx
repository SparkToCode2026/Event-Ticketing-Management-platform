import { Link } from "react-router-dom";
import "../../styles/AdminDashboard.css";

const sections = [
  { name: "Users", path: "/admin/users", icon: "👤" },
  { name: "Organizer Profiles", path: "/admin/organizers", icon: "🧑‍💼" },
  { name: "Events", path: "/admin/events", icon: "📅" },
  { name: "Event Categories", path: "/admin/event-categories", icon: "🏷️" },
  { name: "Venues", path: "/admin/venues", icon: "📍" },
  { name: "Speakers", path: "/admin/speakers", icon: "🎤" },
  { name: "Ticket Types", path: "/admin/ticket-types", icon: "🎟️" },
  { name: "Tickets", path: "/admin/tickets", icon: "🎫" },
  { name: "Orders", path: "/admin/orders", icon: "🧾" },
  { name: "Payments", path: "/admin/payments", icon: "💳" },
  { name: "Reviews", path: "/admin/reviews", icon: "⭐" },
  { name: "Promotions", path: "/admin/promotions", icon: "🏷️" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <p className="admin-subtitle">Manage all platform data</p>

      <div className="admin-grid">
        {sections.map((s) => (
          <Link to={s.path} className="admin-card" key={s.path}>
            <span className="admin-icon">{s.icon}</span>
            <span className="admin-name">{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}