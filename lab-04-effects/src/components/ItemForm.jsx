import { useState } from "react";

const roles = ["Light", "Prop", "Costume", "Sound"];
const conditions = ["Good", "Worn", "Needs work"];
const statuses = [
  { id: "available", label: "Available" },
  { id: "on-stage", label: "On stage" },
  { id: "repair", label: "In repair" },
];

export default function ItemForm({ mode, initial, pending, error, onCancel, onSubmit }) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [role, setRole] = useState(initial.role || "Prop");
  const [bay, setBay] = useState(initial.bay || "");
  const [condition, setCondition] = useState(initial.condition || "Good");
  const [keeper, setKeeper] = useState(initial.keeper || "");
  const [status, setStatus] = useState(initial.status || "available");
  const [acquired, setAcquired] = useState(initial.acquired || "");
  const [note, setNote] = useState(initial.note || "");

  function submit(event) {
    event.preventDefault();
    const nextName = name.trim();
    if (!nextName) return;
    onSubmit({
      name: nextName,
      description: description.trim(),
      role,
      bay: bay.trim() || "Unassigned",
      condition,
      keeper: keeper.trim() || "Unassigned",
      status,
      acquired: acquired.trim() || "Unknown",
      note: note.trim(),
    });
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>{mode === "edit" ? "Edit record" : "New record"}</h2>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
      </label>
      <div className="split">
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            {roles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Bay
          <input value={bay} onChange={(event) => setBay(event.target.value)} />
        </label>
      </div>
      <div className="split">
        <label>
          Condition
          <select value={condition} onChange={(event) => setCondition(event.target.value)}>
            {conditions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Keeper
          <input value={keeper} onChange={(event) => setKeeper(event.target.value)} />
        </label>
      </div>
      <div className="split">
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Acquired
          <input value={acquired} onChange={(event) => setAcquired(event.target.value)} placeholder="Year" />
        </label>
      </div>
      <label>
        Note
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} />
      </label>
      {error ? <p className="banner">{error}</p> : null}
      <div className="row">
        <button type="submit" className="solid" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}
