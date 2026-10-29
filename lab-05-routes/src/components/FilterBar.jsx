import { categoryOptions, progressOptions, sortOptions } from "../labels.js";

export default function FilterBar({ query, onChange }) {
  return (
    <form
      className="filters"
      onSubmit={(event) => event.preventDefault()}
    >
      <label>
        Search
        <input
          value={query.search}
          onChange={(event) => onChange({ search: event.target.value }, { replace: true })}
          placeholder="Name, code, or meaning"
        />
      </label>
      <label>
        Kind
        <select value={query.category} onChange={(event) => onChange({ category: event.target.value })}>
          <option value="all">All kinds</option>
          {categoryOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Progress
        <select value={query.progress} onChange={(event) => onChange({ progress: event.target.value })}>
          {progressOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select value={query.sort} onChange={(event) => onChange({ sort: event.target.value })}>
          {sortOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
