const statusLabel = {
  available: "Available",
  "on-stage": "On stage",
  repair: "In repair",
};

const actions = [
  { id: "available", label: "Make available" },
  { id: "on-stage", label: "Send on stage" },
  { id: "repair", label: "Send to repair" },
];

export default function ItemDetail({
  status,
  item,
  error,
  pending,
  pendingHere,
  actionError,
  onRetry,
  onEdit,
  onRemove,
  onStatus,
}) {
  if (status === "idle") {
    return (
      <div className="state">
        <p>Select an item. Its full record loads after the list, as a separate request.</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="state">
        <p>Loading the record…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="state error">
        <p>{error}</p>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  const fields = [
    ["Role", item.role],
    ["Bay", item.bay],
    ["Condition", item.condition],
    ["Keeper", item.keeper],
    ["Status", statusLabel[item.status] || item.status],
    ["Acquired", item.acquired],
    ["Note", item.note],
  ];

  return (
    <article className="detail">
      <p className="muted">Record {item.id}</p>
      <h2>{item.name}</h2>
      <p className="description">{item.description}</p>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="row">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={item.status === action.id ? "on" : ""}
            disabled={pending || item.status === action.id}
            onClick={() => onStatus(action.id)}
          >
            {action.label}
          </button>
        ))}
      </div>
      {pendingHere ? <p className="muted">Updating this record…</p> : null}
      {actionError ? <p className="banner">{actionError}</p> : null}
      <div className="row">
        <button type="button" onClick={onEdit} disabled={pending}>
          Edit
        </button>
        <button type="button" className="danger" onClick={onRemove} disabled={pending}>
          Remove
        </button>
      </div>
    </article>
  );
}
