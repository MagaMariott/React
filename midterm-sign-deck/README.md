# Sign deck

A study catalog of road signs. The deck is a simulated API: Promises, a short delay, occasional errors, and `localStorage`. The first load seeds 101 signs.

## Run

```bash
npm install
npm run dev
npm run build
```

Deployed app: https://magamariott.github.io/React/signs/

## Screens

- Catalog: search, kind, progress, and sort. Twelve signs per page.
- Detail: one sign, loaded by its id after you open the card.
- Add a sign: a controlled form. The new sign is stored with the rest of the deck.

## Where state lives

`App` only knows which screen is open and which sign id was chosen.

`Catalog` keeps the query and the page of results. Its effect depends on that query. Cleanup drops a response if the query changed before the delay ended.

`SignDetail` loads one sign. The draft textarea is local to that screen. `key={selectedId}` gives each sign its own draft, and leaving the screen clears it. The learned flag is saved through the API, so it is still there when you come back.

`SignForm` keeps the field values until submit.

## Data

`src/api/signs.js` holds the initial records. `src/api/signsApi.js` reads and writes `localStorage` under `sign-deck-data`. React components do not touch storage. Delete that key in the browser to restore the original 101 signs.
