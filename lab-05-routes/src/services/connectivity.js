// Connectivity is confirmed with a real request. navigator.onLine only says that
// a network interface exists, so it is used as a first guess and nothing more.
const PING_URL = `${import.meta.env.BASE_URL}api/ping.json`;
const PROBE_TIMEOUT = 5000;
const RECHECK_WHILE_OFFLINE = 15000;

const listeners = new Set();
let state = { online: navigator.onLine, checking: false, checkedAt: null };
let latestRun = 0;
let running = 0;
let recheckTimer = null;
let started = false;

function setState(patch) {
  const previous = state;
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener(state, previous));
}

// The service worker never answers this address, so a reply means the network works.
async function probe() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
  try {
    const response = await fetch(`${PING_URL}?t=${Date.now()}`, { cache: "no-store", signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function scheduleRecheck() {
  clearTimeout(recheckTimer);
  if (!state.online) {
    recheckTimer = setTimeout(() => verifyConnection({ silent: true }), RECHECK_WHILE_OFFLINE);
  }
}

export async function verifyConnection({ silent = false } = {}) {
  const run = ++latestRun;
  running += 1;
  if (!silent) setState({ checking: true });
  const online = await probe();
  running -= 1;
  if (run !== latestRun) return state.online;
  setState({ online, checking: false, checkedAt: Date.now() });
  scheduleRecheck();
  return online;
}

// Called by the API service when a request failed before any answer arrived.
export function noteNetworkFailure() {
  if (state.online && running === 0) verifyConnection({ silent: true });
}

export function getConnectivity() {
  return state;
}

export function subscribeConnectivity(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startConnectivity() {
  if (started) return;
  started = true;
  window.addEventListener("offline", () => {
    latestRun += 1;
    setState({ online: false, checking: false, checkedAt: Date.now() });
    scheduleRecheck();
  });
  window.addEventListener("online", () => verifyConnection({ silent: true }));
  verifyConnection({ silent: true });
}
