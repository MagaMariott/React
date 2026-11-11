import { Link, useNavigate, useParams } from "react-router";
import { categoryLabel } from "../labels.js";
import { useSignDetail, useUpdateSign } from "../hooks/useSignQueries.js";

export default function SignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sign, error, isPending, isError, refetch } = useSignDetail(id);
  const learned = useUpdateSign();

  function toggleLearned() {
    if (!sign || learned.isPending) return;
    learned.mutate({ id: sign.id, changes: { learned: !sign.learned } });
  }

  if (isPending) return <p className="state">Loading the sign…</p>;

  if (error?.message === "Sign not found") {
    return (
      <div className="state">
        <h1>This sign is not in the deck</h1>
        <p>Nothing is stored under that address.</p>
        <div className="row">
          <Link to="/" className="button">
            Home
          </Link>
          <Link to="/signs" className="button">
            All signs
          </Link>
        </div>
      </div>
    );
  }

  if (isError || !sign) {
    return (
      <div className="state">
        <p>{error?.message || "The sign could not be loaded."}</p>
        <button type="button" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <article className="detail">
      <div className="row">
        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
        <Link to="/signs" className="button">
          All signs
        </Link>
      </div>
      <p className="code">{sign.code}</p>
      <h1>{sign.name}</h1>
      <dl className="facts">
        <div>
          <dt>Code</dt>
          <dd>{sign.code}</dd>
        </div>
        <div>
          <dt>Kind</dt>
          <dd>{categoryLabel(sign.category)}</dd>
        </div>
        <div>
          <dt>Shape</dt>
          <dd>{sign.shape}</dd>
        </div>
        <div>
          <dt>Meaning</dt>
          <dd>{sign.meaning}</dd>
        </div>
        <div>
          <dt>Study note</dt>
          <dd>{sign.note || "No note saved."}</dd>
        </div>
        <div>
          <dt>Progress</dt>
          <dd>{sign.learned ? "Learned" : "Still learning"}</dd>
        </div>
        <div>
          <dt>Record</dt>
          <dd>{sign.id}</dd>
        </div>
      </dl>
      {learned.isError ? <p className="banner">{learned.error.message}</p> : null}
      <button type="button" className="solid" onClick={toggleLearned} disabled={learned.isPending}>
        {learned.isPending ? "Saving…" : sign.learned ? "Mark as still learning" : "Mark as learned"}
      </button>
    </article>
  );
}
