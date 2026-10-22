import { useEffect, useState } from "react";
import { getSign, updateSign } from "../api/signsApi.js";
import StatusPill from "./StatusPill.jsx";

export default function SignDetail({ id, onBack }) {
  const [sign, setSign] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError("");
    setSign(null);

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
    const learned = !sign.learned;
    setPending(true);
    setError("");

    updateSign(signId, { learned })
      .then((updated) => {
        setSign((current) => (current && current.id === signId ? updated : current));
        setPending(false);
      })
      .catch((reason) => {
        setError(reason.message);
        setPending(false);
      });
  }

  if (status === "loading") return <p className="state">Loading the sign…</p>;

  if (status === "error" && !sign) {
    return (
      <div className="state error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
          Try again
        </button>
        <button type="button" onClick={onBack}>
          Back to the deck
        </button>
      </div>
    );
  }

  return (
    <article className="detail">
      <button type="button" onClick={onBack}>
        Back to the deck
      </button>
      <p className="code">{sign.code}</p>
      <h1>{sign.name}</h1>
      <StatusPill category={sign.category} />
      <p className="meaning">{sign.meaning}</p>
      <dl>
        <div>
          <dt>Shape</dt>
          <dd>{sign.shape}</dd>
        </div>
        <div>
          <dt>Study note</dt>
          <dd>{sign.note || "No saved note."}</dd>
        </div>
        <div>
          <dt>Progress</dt>
          <dd>{sign.learned ? "Learned" : "Still learning"}</dd>
        </div>
      </dl>
      <button type="button" className="solid" onClick={toggleLearned} disabled={pending}>
        {pending ? "Saving…" : sign.learned ? "Mark as still learning" : "Mark as learned"}
      </button>
      {error ? <p className="banner">{error}</p> : null}
      <label>
        Draft for this sign
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="This note stays only while this sign is open"
        />
      </label>
    </article>
  );
}
