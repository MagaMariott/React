export default function Pagination({ page, totalPages, total, onPage }) {
  return (
    <nav className="pager" aria-label="Pages">
      <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <p>
        Page {page} of {totalPages}
        <span> · {total} signs</span>
      </p>
      <button type="button" onClick={() => onPage(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </nav>
  );
}
