export default function Header({ onHome, onAdd, adding }) {
  return (
    <header className="top">
      <button type="button" className="wordmark" onClick={onHome}>
        <span>Sign deck</span>
        <small>Road signs for the study stack</small>
      </button>
      <button type="button" className="solid" onClick={onAdd} disabled={adding}>
        Add a sign
      </button>
    </header>
  );
}
