import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { authErrorMessage } from "../services/authErrors.js";

export default function LoginPage() {
  const { user, ready, configured, login, loginWithGoogle } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (ready && user) {
    return <Navigate to={location.state?.from || "/profile"} replace />;
  }

  function fail(reason) {
    setPending(false);
    setError(authErrorMessage(reason));
  }

  function submit(event) {
    event.preventDefault();
    if (pending) return;
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setPending(true);
    setError("");
    login(email.trim(), password).catch(fail);
  }

  function google(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    loginWithGoogle().catch(fail);
  }

  return (
    <form className="form login" onSubmit={submit}>
      <p className="eyebrow">Login</p>
      <h1>Sign in</h1>
      <p className="lede">Email and password, or Google. The session stays in this browser after a refresh.</p>
      {!configured ? (
        <p className="banner">Firebase keys are not set. Copy .env.example to .env.local and fill in the web app config.</p>
      ) : null}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="banner">{error}</p> : null}
      <button type="submit" className="solid" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <button type="button" onClick={google} disabled={pending}>
        Continue with Google
      </button>
      <p className="hint">
        No account yet? <Link to="/signup">Create one</Link>
      </p>
    </form>
  );
}
