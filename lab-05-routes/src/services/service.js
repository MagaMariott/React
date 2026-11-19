import { categoryOptions } from "../labels.js";
import { noteNetworkFailure } from "./connectivity.js";
import { FIRST_LOCAL_ID, readDeck, writeDeck } from "./deckStore.js";

// The public sign API: JSON served from the same site.
//   GET api/signs.json        the whole catalog
//   GET api/signs/<id>.json   one sign
// In production the service worker answers these network-first and marks saved copies.
const API_URL = `${import.meta.env.BASE_URL}api`;
const CACHED_AT = "X-SW-Cached-At";
const shapeOrder = ["triangle", "circle", "rectangle", "diamond", "octagon", "inverted"];

export class ApiError extends Error {
  constructor(message, { status = 0, offline = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.offline = offline;
  }
}

async function request(path, signal) {
  let response;
  try {
    response = await fetch(`${API_URL}/${path}`, { signal, headers: { Accept: "application/json" } });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    noteNetworkFailure();
    throw new ApiError("The sign service cannot be reached.", { offline: true });
  }

  if (response.status === 503 && response.headers.get("X-Offline")) {
    noteNetworkFailure();
    throw new ApiError("You are offline and this was not saved on this device.", { status: 503, offline: true });
  }
  if (response.status === 404) throw new ApiError("Sign not found", { status: 404 });
  if (!response.ok) {
    throw new ApiError(`The sign service answered with ${response.status}.`, { status: response.status });
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("The sign service sent an answer that could not be read.", { status: response.status });
  }
  // The header is present only when the service worker answered with a saved copy.
  return { data, cachedAt: Number(response.headers.get(CACHED_AT)) || null };
}

function isLocalId(id) {
  return Number(id) >= FIRST_LOCAL_ID;
}

function withProgress(sign, deck) {
  return { ...sign, note: "", learned: deck.learned.includes(sign.id) };
}

async function loadCatalog(signal) {
  const { data, cachedAt } = await request("signs.json", signal);
  const deck = readDeck();
  const items = [...data.signs.map((sign) => withProgress(sign, deck)), ...deck.added];
  return { items, cachedAt };
}

function compare(sort) {
  if (sort === "name-desc") return (a, b) => b.name.localeCompare(a.name);
  if (sort === "code") return (a, b) => a.code.localeCompare(b.code);
  if (sort === "code-desc") return (a, b) => b.code.localeCompare(a.code);
  return (a, b) => a.name.localeCompare(b.name);
}

export async function getSigns(
  { search = "", category = "all", progress = "all", sort = "name", page = 1, limit = 12 } = {},
  signal,
) {
  const catalog = await loadCatalog(signal);
  let items = catalog.items;
  const needle = search.trim().toLowerCase();

  if (needle) {
    items = items.filter((sign) =>
      [sign.name, sign.code, sign.meaning].some((value) => value.toLowerCase().includes(needle)),
    );
  }
  if (category !== "all") items = items.filter((sign) => sign.category === category);
  if (progress === "learned") items = items.filter((sign) => sign.learned);
  if (progress === "learning") items = items.filter((sign) => !sign.learned);

  items = [...items].sort(compare(sort));

  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const safePage = totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
    cachedAt: catalog.cachedAt,
  };
}

export async function getSign(id, signal) {
  if (!/^\d+$/.test(String(id))) throw new ApiError("Sign not found", { status: 404 });

  if (isLocalId(id)) {
    const sign = readDeck().added.find((item) => item.id === Number(id));
    if (!sign) throw new ApiError("Sign not found", { status: 404 });
    return { sign, cachedAt: null };
  }

  const { data, cachedAt } = await request(`signs/${Number(id)}.json`, signal);
  return { sign: withProgress(data, readDeck()), cachedAt };
}

export async function createSign(draft, signal) {
  const { items } = await loadCatalog(signal);
  const code = draft.code.trim().toUpperCase();
  if (items.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
    throw new ApiError("That code is already in the deck", { status: 409 });
  }

  const deck = readDeck();
  const sign = {
    id: deck.added.reduce((max, item) => Math.max(max, item.id), FIRST_LOCAL_ID - 1) + 1,
    code,
    name: draft.name.trim(),
    category: draft.category,
    shape: draft.shape,
    meaning: draft.meaning.trim(),
    note: draft.note.trim(),
    learned: false,
  };
  writeDeck({ ...deck, added: [...deck.added, sign] });
  return sign;
}

export async function updateSign(id, changes, signal) {
  const numericId = Number(id);
  const deck = readDeck();

  if (isLocalId(numericId)) {
    if (!deck.added.some((item) => item.id === numericId)) throw new ApiError("Sign not found", { status: 404 });
    const added = deck.added.map((item) => (item.id === numericId ? { ...item, ...changes, id: numericId } : item));
    writeDeck({ ...deck, added });
    return added.find((item) => item.id === numericId);
  }

  // The catalog itself is read-only. Only the learned flag of a public sign is stored locally.
  const { sign } = await getSign(numericId, signal);
  if (typeof changes.learned === "boolean") {
    const learned = deck.learned.filter((item) => item !== numericId);
    if (changes.learned) learned.push(numericId);
    writeDeck({ ...deck, learned });
    return { ...sign, learned: changes.learned };
  }
  return sign;
}

export async function getSignStats(category = "all", signal) {
  const catalog = await loadCatalog(signal);
  let items = catalog.items;
  if (category !== "all") items = items.filter((sign) => sign.category === category);

  const categoryCounts = Object.fromEntries(categoryOptions.map((item) => [item.value, 0]));
  const shapeCounts = Object.fromEntries(shapeOrder.map((shape) => [shape, 0]));
  let learned = 0;

  for (const sign of items) {
    categoryCounts[sign.category] = (categoryCounts[sign.category] || 0) + 1;
    shapeCounts[sign.shape] = (shapeCounts[sign.shape] || 0) + 1;
    if (sign.learned) learned += 1;
  }

  const examples = [...items]
    .sort((a, b) => Number(a.learned) - Number(b.learned) || a.name.localeCompare(b.name))
    .slice(0, 5)
    .map((sign) => ({ id: sign.id, code: sign.code, name: sign.name, learned: sign.learned }));

  return {
    total: items.length,
    learned,
    learning: items.length - learned,
    shapeCount: Object.values(shapeCounts).filter((count) => count > 0).length,
    byCategory: categoryOptions.map((item) => ({
      category: item.value,
      count: categoryCounts[item.value] || 0,
    })),
    byShape: Object.entries(shapeCounts)
      .filter(([, count]) => count > 0)
      .map(([shape, count]) => ({ shape, count })),
    examples,
    cachedAt: catalog.cachedAt,
  };
}
