import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import ComplaintCard from "../components/ComplaintCard";
import type { Complaint } from "../types";

export default function MyComplaints() {
  const [items, setItems] = useState<Complaint[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.myComplaints().then(setItems).catch(e => setError((e as Error).message));
  }, []);

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!items) return <p>Loading your complaints...</p>;

  return (
    <>
      <h2>My complaints</h2>
      {items.length === 0 && (
        <p className="empty">You have not filed anything yet. <Link to="/report">Report your first issue</Link>.</p>
      )}
      <div className="stack">{items.map(c => <ComplaintCard key={c.id} c={c} />)}</div>
    </>
  );
}
