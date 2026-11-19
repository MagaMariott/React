import { Link } from "react-router";
import { useConnectivity, useRecheckConnection } from "../hooks/useConnectivity.js";

export default function OfflinePage() {
  const connection = useConnectivity();
  const recheck = useRecheckConnection();

  return (
    <section className="offline-page">
      <div className="offline-mark" aria-hidden="true" />
      <p className="eyebrow">Offline</p>
      <h1>There is no connection</h1>
      <p className="lede">
        This page opens when the network is gone. Signs and screens you opened before are still kept on this device.
      </p>
      <p className={`status-pill ${connection.online ? "on" : "off"}`} role="status">
        {connection.checking ? "Checking…" : connection.online ? "Online" : "Offline"}
      </p>
      <div className="row">
        <button type="button" className="solid" onClick={() => recheck()} disabled={connection.checking}>
          Retry connection
        </button>
        <Link to="/" className="button">
          Home
        </Link>
        <Link to="/signs" className="button">
          Signs
        </Link>
      </div>
    </section>
  );
}
