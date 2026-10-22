import { useState } from "react";
import { createSign } from "../api/signsApi.js";

const categories = ["warning", "prohibitory", "mandatory", "information", "priority"];
const shapes = {
  warning: "triangle",
  prohibitory: "circle",
  mandatory: "circle",
  information: "rectangle",
  priority: "diamond",
};

const empty = {
  name: "",
  code: "",
  category: "warning",
  meaning: "",
  note: "",
};

export default function SignForm({ onCancel, onCreated }) {
  const [fields, setFields] = useState(empty);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function setField(name, value) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (pending) return;
    const name = fields.name.trim();
    const code = fields.code.trim();
    const meaning = fields.meaning.trim();
    if (!name || !code || !meaning) {
      setError("Name, code, and meaning are required.");
      return;
    }
    setPending(true);
    setError("");
    createSign({
      name,
      code,
      category: fields.category,
      shape: shapes[fields.category],
      meaning,
      note: fields.note,
    })
      .then((sign) => onCreated(sign.id))
      .catch((reason) => {
        setPending(false);
        setError(reason.message);
      });
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>Add a sign</h1>
      <label>
        Name
        <input value={fields.name} onChange={(event) => setField("name", event.target.value)} />
      </label>
      <div className="split">
        <label>
          Code
          <input value={fields.code} onChange={(event) => setField("code", event.target.value)} placeholder="W-36" />
        </label>
        <label>
          Kind
          <select value={fields.category} onChange={(event) => setField("category", event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Meaning
        <textarea value={fields.meaning} onChange={(event) => setField("meaning", event.target.value)} rows={3} />
      </label>
      <label>
        Saved note
        <textarea value={fields.note} onChange={(event) => setField("note", event.target.value)} rows={2} />
      </label>
      <p className="hint">Shape is taken from the kind: {shapes[fields.category]}.</p>
      {error ? <p className="banner">{error}</p> : null}
      <div className="row">
        <button type="submit" className="solid" disabled={pending}>
          {pending ? "Saving…" : "Save sign"}
        </button>
        <button type="button" onClick={onCancel} disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}
