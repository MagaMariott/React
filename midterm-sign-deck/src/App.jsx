import { useState } from "react";
import Catalog from "./components/Catalog.jsx";
import Header from "./components/Header.jsx";
import SignDetail from "./components/SignDetail.jsx";
import SignForm from "./components/SignForm.jsx";

export default function App() {
  const [screen, setScreen] = useState("catalog");
  const [selectedId, setSelectedId] = useState(null);

  function openSign(id) {
    setSelectedId(id);
    setScreen("detail");
  }

  return (
    <>
      <Header
        onHome={() => setScreen("catalog")}
        onAdd={() => setScreen("create")}
        adding={screen === "create"}
      />
      <main>
        {screen === "catalog" ? <Catalog onOpen={openSign} /> : null}
        {screen === "detail" ? (
          <SignDetail key={selectedId} id={selectedId} onBack={() => setScreen("catalog")} />
        ) : null}
        {screen === "create" ? (
          <SignForm onCancel={() => setScreen("catalog")} onCreated={openSign} />
        ) : null}
      </main>
    </>
  );
}
