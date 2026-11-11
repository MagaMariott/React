import { useState } from "react";
import { useNavigate } from "react-router";
import { categoryOptions, shapeFor } from "../labels.js";
import { useCreateSign } from "../hooks/useSignQueries.js";

const empty = {
  name: "",
  code: "",
  category: "warning",
  meaning: "",
  note: "",
};

export default function SignFormPage() {
  const navigate = useNavigate();
  const create = useCreateSign();
  const [fields, setFields] = useState(empty);
  const [error, setError] = useState("");

  function setField(name, value) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (create.isPending) return;
    const name = fields.name.trim();
    const code = fields.code.trim();
    const meaning = fields.meaning.trim();
    if (!name || !code || !meaning) {
      setError("Name, code, and meaning are required.");
      return;
    }
    setError("");
    create.mutate(
      {
        name,
        code,
        category: fields.category,
        shape: shapeFor[fields.category],
        meaning,
        note: fields.note,
      },
      { onSuccess: (sign) => navigate(`/signs/${sign.id}`) },
    );
  }

  const message = error || create.error?.message;

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
            {categoryOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
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
      <p className="hint">Shape is taken from the kind: {shapeFor[fields.category]}.</p>
      {message ? <p className="banner">{message}</p> : null}
      <div className="row">
        <button type="submit" className="solid" disabled={create.isPending}>
          {create.isPending ? "Saving…" : "Save sign"}
        </button>
        <button type="button" onClick={() => navigate("/signs")} disabled={create.isPending}>
          Cancel
        </button>
      </div>
    </form>
  );
}
