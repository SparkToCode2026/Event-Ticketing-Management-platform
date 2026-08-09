import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "../../styles/AdminDashboard.css";

const sections = [
  { name: "Users", path: "/admin/users", icon: "👤", countKey: "users" },
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
  const [userTotal, setUserTotal] = useState(null);

  useEffect(() => {
    async function loadCounts() {
      try {
        const data = await apiRequest("/api/User/role-counts");
        const total = data.reduce((sum, r) => sum + r.count, 0);
        setUserTotal(total);
      } catch {
        setUserTotal(null); // fails silently, card just shows no count
      }
    }
    loadCounts();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <p className="admin-subtitle">Manage all platform data</p>

      <div className="admin-grid">
        {sections.map((s) => (
          <Link to={s.path} className="admin-card" key={s.path}>
            <span className="admin-icon">{s.icon}</span>
            <span className="admin-name">{s.name}</span>
            {s.countKey === "users" && userTotal !== null && (
              <span className="admin-count">{userTotal} total</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}