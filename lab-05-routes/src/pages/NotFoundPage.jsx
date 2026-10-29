import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section className="state">
      <p className="eyebrow">404</p>
      <h1>This page is not on the map</h1>
      <p>The address does not match a screen in Sign routes.</p>
      <Link to="/" className="button solid">
        Home
      </Link>
    </section>
  );
}
