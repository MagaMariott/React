import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";
import PwaBanners from "./PwaBanners.jsx";
import { useConnectivity } from "../hooks/useConnectivity.js";

export default function RootLayout() {
  const connection = useConnectivity();

  return (
    <>
      <header className="top">
        <NavBar />
        <p className={`connection ${connection.online ? "on" : "off"}`} role="status">
          {connection.checking ? "Checking…" : connection.online ? "Online" : "Offline"}
        </p>
      </header>
      <PwaBanners />
      <main>
        <Suspense fallback={<p className="state">Loading the page…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
