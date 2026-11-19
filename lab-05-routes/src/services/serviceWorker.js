// Registers the service worker and reports when a newer build is waiting.
const BASE = import.meta.env.BASE_URL;
const UPDATE_CHECK_EVERY = 60 * 60 * 1000;

const listeners = new Set();
let state = { updateReady: false, offlineReady: false, checking: false };
let registration = null;
let waitingWorker = null;

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function markWaiting(worker) {
  waitingWorker = worker;
  setState({ updateReady: true });
}

// A new worker that finished installing while another one controls the page is an update.
function track(worker) {
  if (!worker) return;
  worker.addEventListener("statechange", () => {
    if (worker.state === "installed" && navigator.serviceWorker.controller) markWaiting(worker);
  });
}

async function register() {
  try {
    registration = await navigator.serviceWorker.register(`${BASE}sw.js`, { scope: BASE });
  } catch (error) {
    console.error("The service worker could not be registered.", error);
    return;
  }

  if (registration.waiting && navigator.serviceWorker.controller) markWaiting(registration.waiting);
  track(registration.installing);
  registration.addEventListener("updatefound", () => track(registration.installing));

  navigator.serviceWorker.ready.then(() => setState({ offlineReady: true }));

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForUpdate();
  });
  setInterval(checkForUpdate, UPDATE_CHECK_EVERY);
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;

  // The first install only claims the page. Any later change of controller means
  // a new build took over, so the page reloads once to run that build.
  let controlled = Boolean(navigator.serviceWorker.controller);
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!controlled) {
      controlled = true;
      return;
    }
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register);
}

// Ask the browser to fetch sw.js again. Resolves to true when a newer build was found.
export async function checkForUpdate() {
  if (!registration) return false;
  setState({ checking: true });
  try {
    await registration.update();
  } catch {
    // Offline, or the server did not answer. The current build keeps running.
  }
  setState({ checking: false });
  return Boolean(registration.installing || registration.waiting);
}

// The Update button: tell the waiting worker to activate. The reload follows controllerchange.
export function applyUpdate() {
  if (waitingWorker) waitingWorker.postMessage({ type: "SKIP_WAITING" });
  else window.location.reload();
}

export function getAppUpdate() {
  return state;
}

export function subscribeAppUpdate(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
