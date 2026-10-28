import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const u = await api.login({ email, password });
      signIn(u);
      navigate(u.role === "ADMIN" ? "/admin" : "/my-complaints");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h2>Log in</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="btn" type="submit">Log in</button>
      <p className="hint">No account yet? <Link to="/register">Create one</Link></p>
    </form>
  );
}
