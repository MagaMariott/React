import { useState } from "react";

const statuses = [
  { id: "open", label: "Open" },
  { id: "on-site", label: "On site" },
  { id: "filed", label: "Filed" },
];

export default function QuestCard({ quest, hidden, onStatus, onRemove, onReset }) {
  const [note, setNote] = useState("");
  const [checks, setChecks] = useState(0);

  console.log("[QuestCard] render", {
    id: quest.id,
    title: quest.title,
    edition: quest.edition,
    status: quest.status,
    hidden,
  });

  return (
    <article className={`card status-${quest.status}`} hidden={hidden}>
      <div className="card-top">
        <div>
          <h2>{quest.title}</h2>
          <p className="place">{quest.place}</p>
        </div>
        <p className={`badge status-${quest.status}`}>
          {statuses.find((item) => item.id === quest.status).label}
        </p>
      </div>

      <div className="status-row" role="group" aria-label={`Status for ${quest.title}`}>
        {statuses.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === quest.status ? "on" : ""}
            aria-pressed={item.id === quest.status}
            onClick={() => onStatus(quest.id, item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="local">
        <div className="checks">
          <p>
            Checks <strong>{checks}</strong>
          </p>
          <button type="button" onClick={() => setChecks(checks + 1)}>
            Add a check
          </button>
        </div>
        <label>
          Note on this card
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="This note stays with the card when you filter or reverse"
          />
        </label>
      </div>

      <div className="card-actions">
        <button type="button" onClick={() => onReset(quest.id)}>
          Reset note
        </button>
        <button type="button" className="danger" onClick={() => onRemove(quest.id)}>
          Remove
        </button>
      </div>
    </article>
  );
}
