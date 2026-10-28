import { useEffect, useState } from "react";
import { api } from "../api";
import ComplaintCard from "../components/ComplaintCard";
import { STATUS_LABELS, type Complaint, type ComplaintStatus } from "../types";

const FILTERS: (ComplaintStatus | "ALL")[] = ["ALL", "SUBMITTED", "IN_PROGRESS", "RESOLVED", "REJECTED"];

function UpdateForm({ c, onSaved }: { c: Complaint; onSaved: (c: Complaint) => void }) {
  const [status, setStatus] = useState<ComplaintStatus>(c.status);
  const [remark, setRemark] = useState(c.adminRemark ?? "");
  const [error, setError] = useState("");

  async function save() {
    setError("");
    try { onSaved(await api.updateStatus(c.id, status, remark)); }
    catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="update">
      <select value={status} onChange={e => setStatus(e.target.value as ComplaintStatus)} aria-label="New status">
        {(Object.keys(STATUS_LABELS) as ComplaintStatus[]).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>
      <input placeholder="Note for the citizen" value={remark} onChange={e => setRemark(e.target.value)} />
      <button className="btn small" onClick={save}>Save update</button>
      {error && <span className="error">{error}</span>}
    </div>
  );
}

export default function AdminDashboard() {
  const [filter, setFilter] = useState<ComplaintStatus | "ALL">("ALL");
  const [items, setItems] = useState<Complaint[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(null);
    api.allComplaints(filter === "ALL" ? undefined : filter)
      .then(setItems).catch(e => setError((e as Error).message));
  }, [filter]);

  const replace = (u: Complaint) =>
    setItems(prev => prev && prev.map(x => (x.id === u.id ? u : x)));

  return (
    <>
      <h2>Admin dashboard</h2>
      <div className="filters" role="tablist">
        {FILTERS.map(f => (
          <button key={f} className={f === filter ? "chip active" : "chip"} onClick={() => setFilter(f)}>
            {f === "ALL" ? "All complaints" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {!items && !error && <p>Loading complaints...</p>}
      {items?.length === 0 && <p className="empty">Nothing in this view.</p>}
      <div className="stack">
        {items?.map(c => (
          <ComplaintCard key={c.id} c={c}>
            <UpdateForm c={c} onSaved={replace} />
          </ComplaintCard>
        ))}
      </div>
    </>
  );
}
