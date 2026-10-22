import StatusPill from "./StatusPill.jsx";

export default function SignCard({ sign, onOpen }) {
  return (
    <li>
      <button type="button" className={`card kind-${sign.category}`} onClick={() => onOpen(sign.id)}>
        <span className="code">{sign.code}</span>
        <strong>{sign.name}</strong>
        <span className="card-foot">
          <StatusPill category={sign.category} />
          {sign.learned ? <span className="learned">Learned</span> : <span className="muted">{sign.shape}</span>}
        </span>
      </button>
    </li>
  );
}
