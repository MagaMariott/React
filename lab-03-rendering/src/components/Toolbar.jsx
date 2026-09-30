const filters = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "on-site", label: "On site" },
  { id: "filed", label: "Filed" },
];

export default function Toolbar({ filter, shown, total, onFilter, onReverse }) {
  console.log("[Toolbar] render", { filter, shown, total });

  return (
    <div className="toolbar">
      <div className="filters" role="group" aria-label="Filter jobs">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === filter ? "on" : ""}
            aria-pressed={item.id === filter}
            onClick={() => onFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="toolbar-side">
        <p>
          {shown} of {total} shown
        </p>
        <button type="button" onClick={onReverse} disabled={total < 2}>
          Reverse order
        </button>
      </div>
    </div>
  );
}
