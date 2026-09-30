import { useState } from "react";
import AddQuest from "./components/AddQuest.jsx";
import Toolbar from "./components/Toolbar.jsx";
import QuestCard from "./components/QuestCard.jsx";

const starter = [
  {
    id: "q1",
    title: "Count neon signs along Abay",
    place: "Abay avenue",
    status: "on-site",
    edition: 0,
  },
  {
    id: "q2",
    title: "Sketch the fog over Kok-Tobe",
    place: "Kok-Tobe",
    status: "open",
    edition: 0,
  },
  {
    id: "q3",
    title: "Log the tram stops after midnight",
    place: "Dostyk",
    status: "filed",
    edition: 0,
  },
  {
    id: "q4",
    title: "Check the stage lights before doors",
    place: "Main hall",
    status: "open",
    edition: 0,
  },
];

export default function App() {
  const [quests, setQuests] = useState(starter);
  const [filter, setFilter] = useState("all");
  const [nextId, setNextId] = useState(5);

  console.log("[App] render", { count: quests.length, filter });

  function addQuest(title, place) {
    const id = `q${nextId}`;
    setNextId(nextId + 1);
    setQuests((list) => [
      { id, title, place, status: "open", edition: 0 },
      ...list,
    ]);
  }

  function setStatus(id, status) {
    setQuests((list) =>
      list.map((quest) => (quest.id === id ? { ...quest, status } : quest))
    );
  }

  function removeQuest(id) {
    setQuests((list) => list.filter((quest) => quest.id !== id));
  }

  function resetNote(id) {
    setQuests((list) =>
      list.map((quest) =>
        quest.id === id ? { ...quest, edition: quest.edition + 1 } : quest
      )
    );
  }

  function reverse() {
    setQuests((list) => [...list].reverse());
  }

  const shown = quests.filter(
    (quest) => filter === "all" || quest.status === filter
  ).length;

  return (
    <>
      <header className="top">
        <p className="eyebrow">Homework 03 · Rendering and state</p>
        <h1>Night watch</h1>
        <p className="lede">
          A board of field jobs. Status lives on the board. The note lives on
          the card. Open the console: every render logs the component that ran.
        </p>
      </header>
      <main>
        <AddQuest onAdd={addQuest} />
        <Toolbar
          filter={filter}
          shown={shown}
          total={quests.length}
          onFilter={setFilter}
          onReverse={reverse}
        />
        {quests.length === 0 ? (
          <p className="empty">The board is clear. Add a job to start again.</p>
        ) : null}
        {quests.length > 0 && shown === 0 ? (
          <p className="empty">Nothing in this filter.</p>
        ) : null}
        <div className="list">
          {quests.map((quest) => (
            <QuestCard
              key={`${quest.id}-${quest.edition}`}
              quest={quest}
              hidden={filter !== "all" && quest.status !== filter}
              onStatus={setStatus}
              onRemove={removeQuest}
              onReset={resetNote}
            />
          ))}
        </div>
      </main>
    </>
  );
}
