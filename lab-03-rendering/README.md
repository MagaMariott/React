# Night watch — rendering and state

A one-page React board for field jobs. Status is stored on the parent. The note and the check count are stored inside each card.

## Run

```bash
npm install
npm run dev
npm run build
```

The production base path is `/React/dashboard/`: https://magamariott.github.io/React/dashboard/

## Where state lives

`App` keeps the list: id, title, place, status, and an edition number. Filter is also state in `App`.

`AddQuest` keeps the draft title and place until submit.

`QuestCard` keeps the note and the check count in its own `useState`. Those values are not copied into the parent.

## Keys

Each card is rendered with `key={`${quest.id}-${quest.edition}`}`.

Filtering hides a card with the `hidden` attribute. The card stays mounted, so the same key keeps the same note and the same check count. Reversing the list moves the DOM nodes, and React matches them by that key, so the note stays on the right job.

Reset note increments `edition`. The key changes, React throws away that card and mounts a new one, and the note and the checks go back to empty. The title, place, and status stay, because those live in the parent.

## Re-renders

`App`, `Toolbar`, `AddQuest`, and `QuestCard` call `console.log` on each render. Typing in a note re-renders only that card. Changing a status re-renders the board, and the other notes are still there because the keys did not change.
