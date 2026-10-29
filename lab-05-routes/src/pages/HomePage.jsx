import { Link } from "react-router";

export default function HomePage() {
  return (
    <section className="hero">
      <img src={`${import.meta.env.BASE_URL}myimage.JPG`} alt="Temirlan Satybaldy" />
      <div>
        <p className="eyebrow">Study deck</p>
        <h1>Road signs you can open by address</h1>
        <p className="lede">
          Search, kind, progress, and the open sign stay in the URL. Refresh the page, or use Back and Forward, and the same screen comes back.
        </p>
        <div className="row">
          <Link to="/signs" className="button solid">
            Browse signs
          </Link>
          <Link to="/dashboard" className="button">
            Dashboard
          </Link>
          <Link to="/about" className="button">
            About
          </Link>
        </div>
      </div>
    </section>
  );
}
