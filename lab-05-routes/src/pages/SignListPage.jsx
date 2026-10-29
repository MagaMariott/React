import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar.jsx";
import Pagination from "../components/Pagination.jsx";
import { SignCard } from "../components/SignCard.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useSignQuery } from "../hooks/useSignQuery.js";
import { getSigns } from "../services/service.js";

export default function SignListPage() {
  const { query, update } = useSignQuery();
  const [reloadKey, setReloadKey] = useState(0);
  const { status, data, error } = useAsync(
    () => getSigns(query),
    [query.search, query.category, query.progress, query.sort, query.page, reloadKey],
  );

  useEffect(() => {
    if (status !== "ready" || !data || data.totalPages === 0) return;
    if (query.page !== data.page) update({ page: data.page }, { replace: true });
  }, [status, data, query.page, update]);

  const showList = data && (status === "ready" || status === "refreshing" || (status === "error" && data.data));

  return (
    <div>
      <h1>Signs</h1>
      <FilterBar query={query} onChange={update} />
      {status === "loading" ? <p className="state">Loading the signs…</p> : null}
      {status === "refreshing" ? <p className="hint">Updating the list…</p> : null}
      {status === "error" ? (
        <div className="banner">
          <p>{error}</p>
          <button type="button" onClick={() => setReloadKey((current) => current + 1)}>
            Try again
          </button>
        </div>
      ) : null}
      {status === "ready" && data?.total === 0 ? <p className="state">No signs match this search.</p> : null}
      {showList && data.total > 0 ? (
        <>
          <ul className="grid">
            {data.data.map((sign) => (
              <SignCard key={sign.id} sign={sign} />
            ))}
          </ul>
          <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onPage={(page) => update({ page })} />
        </>
      ) : null}
    </div>
  );
}
