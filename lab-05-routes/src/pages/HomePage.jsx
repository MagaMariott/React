import { Link } from "react-router";

export default function HomePage() {
  return (
    <section className="hero">
      <img src={`${import.meta.env.BASE_URL}myimage.JPG`} alt="Temirlan Satybaldy" />
      <div>
        <p className="eyebrow">Study deck</p>
        <h1>Road signs you can open by address</h1>
        <p className="lede">
          Search, kind, progress, and the open sign stay in the URL. After the first visit, the shell and the signs you opened stay on this device when the network drops.
        </p>
        <div className="row">
          <Link to="/signs" className="button solid">
            Browse signs
          </Link>
          <Link to="/dashboard" className="button">
            Dashboard
          </Link>
          <Link to="/offline" className="button">
            Offline page
          </Link>
        </div>
      </div>
    </section>
  );
}
