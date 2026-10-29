import { Suspense } from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";

export default function RootLayout() {
  return (
    <>
      <header className="top">
        <NavBar />
      </header>
      <main>
        <Suspense fallback={<p className="state">Loading the page…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
