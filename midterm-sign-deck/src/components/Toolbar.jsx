const categories = [
  ["all", "All kinds"],
  ["warning", "Warning"],
  ["prohibitory", "Prohibitory"],
  ["mandatory", "Mandatory"],
  ["information", "Information"],
  ["priority", "Priority"],
];

const progressOptions = [
  ["all", "Any progress"],
  ["learning", "Still learning"],
  ["learned", "Learned"],
];

const sorts = [
  ["name", "Name A–Z"],
  ["name-desc", "Name Z–A"],
  ["code", "Code A–Z"],
  ["code-desc", "Code Z–A"],
];

export default function Toolbar({ query, onChange }) {
  return (
    <form className="toolbar" onSubmit={(event) => event.preventDefault()}>
      <label>
        Search
        <input
          value={query.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Name, code, or meaning"
        />
      </label>
      <label>
        Kind
        <select value={query.category} onChange={(event) => onChange({ category: event.target.value })}>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Progress
        <select value={query.progress} onChange={(event) => onChange({ progress: event.target.value })}>
          {progressOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select value={query.sort} onChange={(event) => onChange({ sort: event.target.value })}>
          {sorts.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
