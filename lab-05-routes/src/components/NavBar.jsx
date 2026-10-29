import { NavLink } from "react-router";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/signs", label: "Signs" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/login", label: "Login" },
];

export default function NavBar() {
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
      </nav>
    </div>
  );
}
