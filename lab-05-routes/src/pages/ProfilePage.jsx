import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout().then(() => navigate("/"));
  }

  return (
    <section className="detail">
      <p className="eyebrow">Profile</p>
      <h1>{user.displayName || "Signed in"}</h1>
      <dl className="facts">
        <div>
          <dt>Email</dt>
          <dd>{user.email || "No email on this account"}</dd>
        </div>
        <div>
          <dt>UID</dt>
          <dd className="uid">{user.uid}</dd>
        </div>
      </dl>
      <button type="button" className="solid" onClick={onLogout}>
        Log out
      </button>
    </section>
  );
}
