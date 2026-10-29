import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { categoryLabel } from "../labels.js";
import { getSign, updateSign } from "../services/service.js";

export default function SignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState("loading");
  const [sign, setSign] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setSign(null);
    setError("");
    setActionError("");
    getSign(id)
      .then((next) => {
        if (!active) return;
        setSign(next);
        setStatus("ready");
      })
      .catch((reason) => {
        if (!active) return;
        setError(reason.message);
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  function toggleLearned() {
    if (!sign || pending) return;
    const signId = sign.id;
    setPending(true);
    setActionError("");
    updateSign(signId, { learned: !sign.learned })
      .then((updated) => {
        setSign((current) => (current && current.id === signId ? updated : current));
      })
      .catch((reason) => setActionError(reason.message))
      .finally(() => setPending(false));
  }

  if (status === "loading") return <p className="state">Loading the sign…</p>;

  if (error === "Sign not found") {
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

  if (status === "error" || !sign) {
    return (
      <div className="state">
        <p>{error || "The sign could not be loaded."}</p>
        <button type="button" onClick={() => setReloadKey((current) => current + 1)}>
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
      {actionError ? <p className="banner">{actionError}</p> : null}
      <button type="button" className="solid" onClick={toggleLearned} disabled={pending}>
        {pending ? "Saving…" : sign.learned ? "Mark as still learning" : "Mark as learned"}
      </button>
    </article>
  );
}
