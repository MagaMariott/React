import { useEffect, useState } from "react";
import { getSigns } from "../api/signsApi.js";
import Pagination from "./Pagination.jsx";
import SignList from "./SignList.jsx";
import Toolbar from "./Toolbar.jsx";

const initialQuery = {
  search: "",
  category: "all",
  progress: "all",
  sort: "name",
  page: 1,
};

export default function Catalog({ onOpen }) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus((current) => (current === "ready" ? "refreshing" : "loading"));
    setError("");

    getSigns(query)
      .then((next) => {
        if (!active) return;
        if (next.totalPages > 0 && query.page > next.totalPages) {
          setQuery((current) => ({ ...current, page: next.totalPages }));
          return;
        }
        setResult(next);
        setStatus("ready");
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason.message);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [query, reloadKey]);

  function update(patch) {
    setQuery((current) => ({ ...current, page: 1, ...patch }));
  }

  const showing = result?.data ?? [];
  const failedFirstLoad = status === "error" && !result;

  return (
    <section className="catalog">
      <Toolbar query={query} onChange={update} />

      {status === "loading" && !result ? <p className="state">Loading the deck…</p> : null}
      {status === "refreshing" ? <p className="hint">Updating the deck…</p> : null}

      {failedFirstLoad ? (
        <div className="state error">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
            Try again
          </button>
        </div>
      ) : null}

      {status === "error" && result ? (
        <p className="banner">
          {error} The cards on screen are from the last successful load.
          <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
            Try again
          </button>
        </p>
      ) : null}

      {status !== "loading" && result && result.total === 0 ? (
        <p className="state">No signs match this search.</p>
      ) : null}

      {showing.length > 0 ? <SignList signs={showing} onOpen={onOpen} /> : null}

      {result && result.totalPages > 1 ? (
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          onPage={(page) => setQuery((current) => ({ ...current, page }))}
        />
      ) : null}
    </section>
  );
}
