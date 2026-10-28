import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import type { Notice } from "../types";

export default function Notices() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const load = () => api.notices().then(setItems).catch(e => setError((e as Error).message));
  useEffect(() => { load(); }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    try {
      await api.addNotice({ title, body });
      setTitle(""); setBody("");
      load();
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <>
      <h2>City notices</h2>
      {error && <p className="error" role="alert">{error}</p>}
      {user?.role === "ADMIN" && (
        <form className="panel" onSubmit={add}>
          <h3>Publish a notice</h3>
          <label>Title<input value={title} onChange={e => setTitle(e.target.value)} required /></label>
          <label>Message<textarea rows={3} value={body} onChange={e => setBody(e.target.value)} required /></label>
          <button className="btn" type="submit">Publish notice</button>
        </form>
      )}
      {items.length === 0 && <p className="empty">No notices right now.</p>}
      <div className="stack">
        {items.map(n => (
          <article key={n.id} className="notice">
            <h3>{n.title}</h3>
            <time>{new Date(n.publishedAt).toLocaleDateString()}</time>
            <p>{n.body}</p>
            {user?.role === "ADMIN" && (
              <button className="linklike" onClick={() => api.deleteNotice(n.id).then(load)}>Delete notice</button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
