// Sign routes service worker.
// The build replaces the two placeholders below (see vite.config.js).
const VERSION = "20261119-005604";
const PRECACHE_URLS = ["assets/AboutPage-CpRUqAiQ.js","assets/DashboardPage-CFlMs0LS.js","assets/LoginPage-wIFz47lH.js","assets/NotFoundPage-CC-haNWE.js","assets/OfflinePage-BMJo6j8B.js","assets/ProfilePage-ClItPnlT.js","assets/SignDetailPage-BlLIhxpr.js","assets/SignFormPage-CgAtS0iq.js","assets/SignupPage-O5nlg3di.js","assets/authErrors-B_pqz7Ci.js","assets/index-BxKmKT97.css","assets/index-DpdvI-RL.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","manifest.json","myimage.JPG","offline.html"];

const PREFIX = "sign-routes-";
const SHELL_CACHE = `${PREFIX}shell-${VERSION}`;
const API_CACHE = `${PREFIX}api-v1`;
const STATIC_CACHE = `${PREFIX}static-v1`;
const CURRENT_CACHES = [SHELL_CACHE, API_CACHE, STATIC_CACHE];

const API_MAX_ENTRIES = 60;
const API_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const STATIC_MAX_ENTRIES = 40;
const STATIC_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const NETWORK_TIMEOUT = 5000;

const FETCHED_AT = "X-SW-Fetched-At";
const CACHED_AT = "X-SW-Cached-At";

const SCOPE = self.registration.scope;
const SCOPE_PATH = new URL(SCOPE).pathname;
const SHELL_URL = new URL("index.html", SCOPE).href;
const OFFLINE_URL = new URL("offline.html", SCOPE).href;
const API_PATH = new URL("api/", SCOPE).pathname;
const PING_PATH = new URL("api/ping.json", SCOPE).pathname;
const PRECACHED = new Set(PRECACHE_URLS.map((path) => new URL(path, SCOPE).href));

// install: download the application shell into a cache named after this build.
// cache: "reload" skips the HTTP cache, so a new build never stores an old index.html.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll([...PRECACHED].map((url) => new Request(url, { cache: "reload" })))),
  );
});

// activate: drop caches left by older builds, then take over open pages.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith(PREFIX) && !CURRENT_CACHES.includes(name))
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// A waiting build becomes active only when the page asks for it (the Update button).
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Firebase and Google requests are cross-origin. They are never handled or cached here.
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(SCOPE_PATH)) return;
  // The connectivity check must always reach the network.
  if (url.pathname === PING_PATH) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }
  if (url.pathname.startsWith(API_PATH)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (PRECACHED.has(url.href)) {
    event.respondWith(fromShell(request));
    return;
  }
  if (request.destination === "image" || request.destination === "font") {
    event.respondWith(cacheFirst(request));
  }
});

// Every in-app address is answered with the precached shell, online or offline.
// If the shell cannot be served at all, the precached offline page is the answer.
async function handleNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  if (request.url === OFFLINE_URL) {
    const page = await cache.match(OFFLINE_URL);
    if (page) return page;
  }
  const shell = await cache.match(SHELL_URL);
  if (shell) return shell;
  try {
    return await fetch(request);
  } catch {
    const offline = await cache.match(OFFLINE_URL);
    return offline || new Response("You are offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

// Built JS, CSS, icons, and the manifest: served from this build's cache.
async function fromShell(request) {
  const cache = await caches.open(SHELL_CACHE);
  return (await cache.match(request.url)) || fetch(request);
}

// Public sign API: network first. A saved copy answers when the network fails.
async function networkFirst(request) {
  const cache = await caches.open(API_CACHE);
  try {
    const response = await fetchFresh(request);
    if (response.ok) {
      await save(cache, request.url, response.clone(), API_MAX_ENTRIES);
      return response;
    }
    if (response.status < 500) return response;
    throw new Error(`The server answered ${response.status}`);
  } catch {
    const saved = await readSaved(cache, request.url, API_MAX_AGE);
    if (saved) return asSavedCopy(saved);
    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "X-Offline": "1" },
    });
  }
}

// Images and fonts: cache first. The network is used only for a miss.
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const saved = await readSaved(cache, request.url, STATIC_MAX_AGE);
  if (saved) return saved;
  try {
    const response = await fetch(request);
    if (response.ok) await save(cache, request.url, response.clone(), STATIC_MAX_ENTRIES);
    return response;
  } catch {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

// A network request that skips the HTTP cache and gives up after a few seconds.
function fetchFresh(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT);
  return fetch(request.url, {
    cache: "no-store",
    credentials: "same-origin",
    headers: request.headers,
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
}

function copyHeaders(response) {
  const headers = new Headers(response.headers);
  headers.delete("Content-Encoding");
  headers.delete("Content-Length");
  return headers;
}

// Store a response with the time it was fetched, then keep only the newest entries.
async function save(cache, url, response, maxEntries) {
  try {
    const headers = copyHeaders(response);
    headers.set(FETCHED_AT, String(Date.now()));
    const body = await response.blob();
    await cache.put(url, new Response(body, { status: response.status, statusText: response.statusText, headers }));
    const keys = await cache.keys();
    const extra = keys.length - maxEntries;
    for (let index = 0; index < extra; index += 1) await cache.delete(keys[index]);
  } catch {
    // A full disk must not turn a good network answer into an error.
  }
}

// Return a saved response, or nothing when it is missing or too old.
async function readSaved(cache, url, maxAge) {
  const saved = await cache.match(url);
  if (!saved) return undefined;
  const fetchedAt = Number(saved.headers.get(FETCHED_AT));
  if (!fetchedAt || Date.now() - fetchedAt > maxAge) {
    await cache.delete(url);
    return undefined;
  }
  return saved;
}

// Tell the page that this answer is a saved copy and when it was fetched.
async function asSavedCopy(saved) {
  const headers = copyHeaders(saved);
  headers.set(CACHED_AT, saved.headers.get(FETCHED_AT));
  return new Response(await saved.blob(), { status: saved.status, statusText: saved.statusText, headers });
}
