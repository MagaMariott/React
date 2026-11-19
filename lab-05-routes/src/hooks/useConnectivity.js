import { useSyncExternalStore } from "react";
import { getConnectivity, startConnectivity, subscribeConnectivity, verifyConnection } from "../services/connectivity.js";

startConnectivity();

export function useConnectivity() {
  return useSyncExternalStore(subscribeConnectivity, getConnectivity, getConnectivity);
}

export function useRecheckConnection() {
  return verifyConnection;
}
