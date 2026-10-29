import { Link } from "react-router";
import { categoryLabel } from "../labels.js";

export default function StatusPill({ category }) {
  return <span className={`pill kind-${category}`}>{categoryLabel(category)}</span>;
}

export function SignCard({ sign }) {
  return (
    <li>
      <Link to={`/signs/${sign.id}`} className={`card kind-${sign.category}`}>
        <span className="code">{sign.code}</span>
        <strong>{sign.name}</strong>
        <span className="card-foot">
          <StatusPill category={sign.category} />
          {sign.learned ? <span className="learned">Learned</span> : <span className="muted">{sign.shape}</span>}
        </span>
      </Link>
    </li>
  );
}
