# Cage ledger — effects and a fake API

A one-page React app for the hall's props and lights. The list and each record come from the course fake API: Promises, a random delay, occasional errors, and `localStorage`.

## Run

```bash
npm install
npm run dev
npm run build
```

The production base path is `/React/ledger/`: https://magamariott.github.io/React/ledger/

## What loads where

`useEffect` in `App` loads the list when `listNonce` changes. Reload, retry, create, edit, and remove bump that number.

A second `useEffect` loads one record when `selectedId` or `detailNonce` changes. The cleanup sets a flag so a slow response cannot replace a newer selection.

The status buttons capture the record id at the click. The response updates that id, even if another record is open by then. A second status change waits until the first request settles.

Components do not read `localStorage`. Only `src/api/fakeApi.js` does.
