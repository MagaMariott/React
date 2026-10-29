import { NavLink, Outlet } from "react-router";

export default function SignsLayout() {
  return (
    <section>
      <nav className="subnav" aria-label="Signs">
        <NavLink to="/signs" end>
          All signs
        </NavLink>
        <NavLink to="/signs/new">Add a sign</NavLink>
      </nav>
      <Outlet />
    </section>
  );
}
