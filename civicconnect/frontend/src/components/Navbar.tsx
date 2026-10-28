import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="nav">
      <NavLink to="/" className="brand">CivicConnect</NavLink>
      <nav>
        <NavLink to="/notices">Notices</NavLink>
        {user && <NavLink to="/report">Report an issue</NavLink>}
        {user && user.role === "CITIZEN" && <NavLink to="/my-complaints">My complaints</NavLink>}
        {user?.role === "ADMIN" && <NavLink to="/admin">Admin dashboard</NavLink>}
        {!user && <NavLink to="/login">Log in</NavLink>}
        {!user && <NavLink to="/register" className="btn small">Create account</NavLink>}
        {user && (
          <button className="linklike" onClick={() => { signOut(); navigate("/"); }}>
            Log out ({user.name.split(" ")[0]})
          </button>
        )}
      </nav>
    </header>
  );
}
