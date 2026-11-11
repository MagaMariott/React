import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/signs", label: "Signs" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

export default function NavBar() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout().then(() => navigate("/"));
  }

  return (
    <div className="bar">
      <NavLink to="/" className="wordmark" end>
        <strong>Sign routes</strong>
        <span>Road signs, with real URLs</span>
      </NavLink>
      <nav className="nav" aria-label="Primary">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}>
            {link.label}
          </NavLink>
        ))}
        {ready && !user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        ) : null}
        {ready && user ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}
      </nav>
    </div>
  );
}
