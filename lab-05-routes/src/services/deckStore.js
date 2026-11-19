// What belongs to this browser only: which signs are marked as learned and the signs
// the user added. It lives in localStorage and never enters the service worker caches.
const DECK_KEY = "sign-routes-deck";
const LEGACY_KEY = "sign-routes-data";
const LEGACY_SERVER_COUNT = 101;

export const FIRST_LOCAL_ID = 1001;

function emptyDeck() {
  return { learned: [], added: [] };
}

// Earlier versions kept the whole catalog under one key. Carry the user's part over once.
function migrateLegacy() {
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return null;
  localStorage.removeItem(LEGACY_KEY);
  try {
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) return null;
    return {
      learned: items.filter((item) => item.learned && item.id <= LEGACY_SERVER_COUNT).map((item) => item.id),
      added: items
        .filter((item) => item.id > LEGACY_SERVER_COUNT)
        .map((item, index) => ({ ...item, id: FIRST_LOCAL_ID + index })),
    };
  } catch {
    return null;
  }
}

export function readDeck() {
  try {
    const raw = localStorage.getItem(DECK_KEY);
    if (raw) {
      const deck = JSON.parse(raw);
      return {
        learned: Array.isArray(deck.learned) ? deck.learned : [],
        added: Array.isArray(deck.added) ? deck.added : [],
      };
    }
    const migrated = migrateLegacy();
    if (migrated) {
      writeDeck(migrated);
      return migrated;
    }
  } catch {
    // Unreadable storage is treated as an empty deck.
  }
  return emptyDeck();
}

export function writeDeck(deck) {
  localStorage.setItem(DECK_KEY, JSON.stringify(deck));
}
