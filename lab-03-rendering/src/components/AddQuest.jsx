import { useState } from "react";

export default function AddQuest({ onAdd }) {
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");

  console.log("[AddQuest] render", { draft: title.length > 0 });

  function submit(event) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    const nextPlace = place.trim() || "Almaty";
    onAdd(nextTitle, nextPlace);
    setTitle("");
    setPlace("");
  }

  return (
    <form className="add" onSubmit={submit}>
      <label>
        Job
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs doing"
          autoComplete="off"
        />
      </label>
      <label>
        Place
        <input
          value={place}
          onChange={(event) => setPlace(event.target.value)}
          placeholder="Where"
          autoComplete="off"
        />
      </label>
      <button type="submit">Add job</button>
    </form>
  );
}
