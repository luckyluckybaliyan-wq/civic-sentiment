import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";

export default function Register() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      signIn(await api.register(form));
      navigate("/report");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h2>Create your account</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Full name<input value={form.name} onChange={set("name")} required /></label>
      <label>Email<input type="email" value={form.email} onChange={set("email")} required /></label>
      <label>Phone (optional)<input value={form.phone} onChange={set("phone")} /></label>
      <label>Password (6+ characters)<input type="password" minLength={6} value={form.password} onChange={set("password")} required /></label>
      <button className="btn" type="submit">Create account</button>
      <p className="hint">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
