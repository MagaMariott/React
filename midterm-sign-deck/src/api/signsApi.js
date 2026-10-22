import { initialSigns } from "./signs.js";

const DATA_KEY = "sign-deck-data";
const minDelay = 350;
const maxDelay = 1100;
const errorChance = 0.06;

function fakeRequest(operation) {
  return new Promise((resolve, reject) => {
    const delay = minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1));
    setTimeout(() => {
      if (Math.random() < errorChance) {
        reject(new Error("Simulated server Error"));
        return;
      }
      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

function readData() {
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialSigns));
  }
  return JSON.parse(localStorage.getItem(DATA_KEY));
}

function writeData(items) {
  localStorage.setItem(DATA_KEY, JSON.stringify(items));
}

function compare(sort) {
  if (sort === "name-desc") return (a, b) => b.name.localeCompare(a.name);
  if (sort === "code") return (a, b) => a.code.localeCompare(b.code);
  if (sort === "code-desc") return (a, b) => b.code.localeCompare(a.code);
  return (a, b) => a.name.localeCompare(b.name);
}

export function getSigns({
  search = "",
  category = "all",
  progress = "all",
  sort = "name",
  page = 1,
  limit = 12,
} = {}) {
  return fakeRequest(() => {
    let items = readData();
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
    };
  });
}

export function getSign(id) {
  return fakeRequest(() => {
    const sign = readData().find((item) => item.id === Number(id));
    if (!sign) throw new Error("Sign not found");
    return sign;
  });
}

export function createSign(draft) {
  return fakeRequest(() => {
    const items = readData();
    const code = draft.code.trim().toUpperCase();
    if (items.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
      throw new Error("That code is already in the deck");
    }
    const sign = {
      id: items.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      code,
      name: draft.name.trim(),
      category: draft.category,
      shape: draft.shape,
      meaning: draft.meaning.trim(),
      note: draft.note.trim(),
      learned: false,
    };
    writeData([...items, sign]);
    return sign;
  });
}

export function updateSign(id, changes) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();
    if (!items.some((item) => item.id === numericId)) throw new Error("Sign not found");
    const next = items.map((item) => (item.id === numericId ? { ...item, ...changes, id: numericId } : item));
    writeData(next);
    return next.find((item) => item.id === numericId);
  });
}
