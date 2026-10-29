import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setNotice("Email and password are required.");
      return;
    }
    setNotice("Sign-in is not connected yet. This screen is only the layout for a later auth step.");
  }

  return (
    <form className="form login" onSubmit={submit}>
      <p className="eyebrow">Login</p>
      <h1>Sign in later</h1>
      <p className="lede">Nothing is checked against an account. The fields are here so the screen is ready.</p>
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
      <button type="submit" className="solid">
        Continue
      </button>
      {notice ? <p className="banner">{notice}</p> : null}
    </form>
  );
}
