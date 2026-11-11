import { useState } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";
import { authErrorMessage } from "../services/authErrors.js";

export default function SignupPage() {
  const { user, ready, configured, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (ready && user) return <Navigate to="/profile" replace />;

  function submit(event) {
    event.preventDefault();
    if (pending) return;
    const nextEmail = email.trim();
    if (!nextEmail || !nextEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The passwords do not match.");
      return;
    }
    setPending(true);
    setError("");
    signup(nextEmail, password).catch((reason) => {
      setPending(false);
      setError(authErrorMessage(reason));
    });
  }

  return (
    <form className="form login" onSubmit={submit}>
      <p className="eyebrow">Signup</p>
      <h1>Create an account</h1>
      <p className="lede">Email and password only. A matching confirmation is required before anything is sent.</p>
      {!configured ? (
        <p className="banner">Firebase keys are not set. Copy .env.example to .env.local and fill in the web app config.</p>
      ) : null}
      <label>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
      </label>
      <label>
        Confirm password
        <input
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
        />
      </label>
      {error ? <p className="banner">{error}</p> : null}
      <button type="submit" className="solid" disabled={pending}>
        {pending ? "Creating…" : "Create account"}
      </button>
      <p className="hint">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
