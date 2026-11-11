import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, firebaseConfigured, googleProvider } from "../services/firebase.js";

const AuthContext = createContext(null);

function missingConfig() {
  const error = new Error("Firebase is not configured.");
  error.code = "auth/missing-config";
  return error;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!firebaseConfigured);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      configured: firebaseConfigured,
      signup(email, password) {
        if (!auth) return Promise.reject(missingConfig());
        return createUserWithEmailAndPassword(auth, email, password);
      },
      login(email, password) {
        if (!auth) return Promise.reject(missingConfig());
        return signInWithEmailAndPassword(auth, email, password);
      },
      loginWithGoogle() {
        if (!auth) return Promise.reject(missingConfig());
        return signInWithPopup(auth, googleProvider);
      },
      logout() {
        if (!auth) return Promise.resolve();
        return signOut(auth);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
