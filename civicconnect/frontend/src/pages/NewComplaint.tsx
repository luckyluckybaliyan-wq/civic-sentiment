import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { CATEGORY_LABELS, type Category } from "../types";

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "ROAD" as Category, ward: "", address: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.createComplaint(form);
      navigate("/my-complaints");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2>Report an issue</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Short title
        <input maxLength={120} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      </label>
      <label>Category
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}>
          {(Object.keys(CATEGORY_LABELS) as Category[]).map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
      </label>
      <div className="row">
        <label>Ward
          <input placeholder="e.g. Ward 4" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} required />
        </label>
        <label>Street or landmark
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </label>
      </div>
      <label>What is the problem?
        <textarea rows={5} maxLength={2000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
      </label>
      <button className="btn" type="submit" disabled={busy}>{busy ? "Submitting..." : "Submit complaint"}</button>
    </form>
  );
}
