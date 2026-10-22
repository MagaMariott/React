const statusLabel = {
  available: "Available",
  "on-stage": "On stage",
  repair: "In repair",
};

export default function ItemList({
  items,
  selectedId,
  status,
  error,
  onSelect,
  onReload,
  onCreate,
  onRetry,
}) {
  return (
    <section className="list-panel">
      <div className="panel-head">
        <h2>In the cage</h2>
        <div className="row">
          <button type="button" onClick={onReload} disabled={status === "loading" || status === "refreshing"}>
            {status === "refreshing" ? "Reloading…" : "Reload"}
          </button>
          <button type="button" className="solid" onClick={onCreate}>
            Add item
          </button>
        </div>
      </div>

      {status === "loading" ? <p className="state">Loading the list…</p> : null}

      {status === "error" && items.length === 0 ? (
        <div className="state error">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : null}

      {status === "error" && items.length > 0 ? (
        <p className="banner">{error} The list on screen is the last successful load.</p>
      ) : null}

      {status !== "loading" && status !== "error" && items.length === 0 ? (
        <p className="state">The cage is empty. Add an item to start a record.</p>
      ) : null}

      {items.length > 0 ? (
        <ul className="items">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={item.id === selectedId ? "item on" : "item"}
                onClick={() => onSelect(item.id)}
              >
                <span>
                  <strong>{item.name}</strong>
                  <span className="muted">{item.role}</span>
                </span>
                <span className={`pill status-${item.status}`}>{statusLabel[item.status] || item.status}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
