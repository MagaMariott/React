import { Link, useSearchParams } from "react-router";
import { categoryLabel, categoryOptions } from "../labels.js";
import { useSignStats } from "../hooks/useSignQueries.js";

export default function DashboardPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("category") || "all";
  const category = requested === "all" || categoryOptions.some((item) => item.value === requested) ? requested : "all";
  const { data, error, isPending, isFetching, isError, refetch } = useSignStats(category);

  const listQuery = category === "all" ? "" : `?category=${category}`;

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="lede">Counts come from the sign service. The same kind is cached for a minute, then fetched again.</p>
      <label className="narrow">
        Kind
        <select
          value={category}
          onChange={(event) => {
            const next = event.target.value;
            setParams(next === "all" ? {} : { category: next });
          }}
        >
          <option value="all">All kinds</option>
          {categoryOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {isPending ? <p className="state">Loading the statistics…</p> : null}
      {isFetching && !isPending ? <p className="hint">Updating the statistics…</p> : null}
      {isError && !data ? (
        <div className="state">
          <p>{error.message}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : null}
      {isError && data ? (
        <div className="banner">
          <p>{error.message}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : null}
      {data && data.total === 0 && !isPending ? <p className="state">No signs in this kind.</p> : null}
      {data && data.total > 0 ? (
        <>
          <section className="stats">
            <Link to={`/signs${listQuery}`} className="stat">
              <span>Signs</span>
              <strong>{data.total}</strong>
            </Link>
            <Link to={`/signs${listQuery}${listQuery ? "&" : "?"}progress=learned`} className="stat">
              <span>Learned</span>
              <strong>{data.learned}</strong>
            </Link>
            <Link to={`/signs${listQuery}${listQuery ? "&" : "?"}progress=learning`} className="stat">
              <span>Still learning</span>
              <strong>{data.learning}</strong>
            </Link>
            <article className="stat">
              <span>Shapes</span>
              <strong>{data.shapeCount}</strong>
            </article>
          </section>
          <div className="split-panels">
            <Breakdown title="By kind" rows={data.byCategory.map((row) => ({
              key: row.category,
              label: categoryLabel(row.category),
              count: row.count,
              to: `/signs?category=${row.category}`,
            }))} />
            <Breakdown title="By shape" rows={data.byShape.map((row) => ({
              key: row.shape,
              label: row.shape,
              count: row.count,
            }))} />
          </div>
          <section>
            <h2>Open a sign</h2>
            <ul className="examples">
              {data.examples.map((sign) => (
                <li key={sign.id}>
                  <Link to={`/signs/${sign.id}`}>
                    {sign.code} {sign.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
}

function Breakdown({ title, rows }) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <section>
      <h2>{title}</h2>
      <ul className="bars">
        {rows.map((row) => (
          <li key={row.key}>
            {row.to ? <Link to={row.to}>{row.label}</Link> : <span>{row.label}</span>}
            <span className="track" aria-hidden="true">
              <span className="fill" style={{ width: `${(row.count / max) * 100}%` }} />
            </span>
            <b>{row.count}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}
