import { useEffect } from "react";
import CachedNotice from "../components/CachedNotice.jsx";
import FilterBar from "../components/FilterBar.jsx";
import Pagination from "../components/Pagination.jsx";
import { SignCard } from "../components/SignCard.jsx";
import { useConnectivity } from "../hooks/useConnectivity.js";
import { useSignList } from "../hooks/useSignQueries.js";
import { useSignQuery } from "../hooks/useSignQuery.js";

export default function SignListPage() {
  const { query, update } = useSignQuery();
  const connection = useConnectivity();
  const { data, error, isPending, isFetching, isError, isSuccess, refetch } = useSignList(query);

  useEffect(() => {
    if (!isSuccess || !data || data.totalPages === 0) return;
    if (query.page !== data.page) update({ page: data.page }, { replace: true });
  }, [isSuccess, data, query.page, update]);

  return (
    <div>
      <h1>Signs</h1>
      <FilterBar query={query} onChange={update} />
      <CachedNotice cachedAt={data?.cachedAt} offline={!connection.online && Boolean(data)} />
      {isPending ? <p className="state">Loading the signs…</p> : null}
      {isFetching && !isPending ? <p className="hint">Updating the list…</p> : null}
      {isError ? (
        <div className="banner">
          <p>{error.message}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : null}
      {isSuccess && data?.total === 0 ? <p className="state">No signs match this search.</p> : null}
      {data && data.total > 0 ? (
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
