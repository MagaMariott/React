import { useSyncExternalStore } from "react";
import { applyUpdate, getAppUpdate, subscribeAppUpdate } from "../services/serviceWorker.js";

export function useAppUpdate() {
  return useSyncExternalStore(subscribeAppUpdate, getAppUpdate, getAppUpdate);
}

export { applyUpdate };
