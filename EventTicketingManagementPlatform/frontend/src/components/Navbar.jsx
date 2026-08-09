import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link className="logo" to="/">
        Hexa<span>Code</span>
      </Link>

      <div className="nav-links">
        <Link to="/events">Events</Link>
        <Link to="/venues">Venues</Link>
        <Link to="/contact">Contact</Link>

        {user && <Link to="/orders">My Orders</Link>}
        {user && <Link to="/profile">My Profile</Link>}
        {user?.role === "Organizer" && (
          <>
            <Link to="/my-events">My Events</Link>
            <Link to="/add-event">Add Event</Link>
          </>
        )}
        {user?.role === "Admin" && <Link to="/admin">Admin Panel</Link>}
      </div>

      <div className="nav-buttons">
        {user ? (
          <>
            <span className="nav-greeting">Hi, {user.userName}</span>
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="login-btn" to="/login">Login</Link>
            <Link className="register-btn" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}