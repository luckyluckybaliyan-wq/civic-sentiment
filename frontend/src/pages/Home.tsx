import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import type { Stats } from "../types";

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => { api.stats().then(setStats).catch(() => setStats(null)); }, []);

  const open = stats ? stats.submitted + stats.inProgress : 0;
  const closed = stats ? stats.resolved + stats.rejected : 0;

  return (
    <>
      <section className="hero">
        <div>
          <h1>Spotted a broken streetlight or a pothole? Tell the city once, then watch it get fixed.</h1>
          <p className="lead">
            File a complaint with your ward and location, follow its status, and read the municipality's notes on every update.
          </p>
          <div className="actions">
            <Link className="btn" to={user ? "/report" : "/register"}>{user ? "Report an issue" : "Create a free account"}</Link>
            <Link className="btn ghost" to="/notices">Read city notices</Link>
          </div>
        </div>
        <aside className="board" aria-label="Complaint statistics">
          <p className="board-title">Complaint board</p>
          <ul>
            <li><span>Waiting or being fixed</span><b>{open}</b></li>
            <li><span>Closed</span><b>{closed}</b></li>
            <li><span>Resolved</span><b>{stats?.resolved ?? 0}</b></li>
            <li><span>Total filed</span><b>{stats?.total ?? 0}</b></li>
          </ul>
        </aside>
      </section>

      <section className="steps">
        <h2>How a complaint moves</h2>
        <ol>
          <li><strong>You file it.</strong> Pick a category, your ward and the exact place.</li>
          <li><strong>The municipality reviews it.</strong> An officer marks it in progress or rejects it with a reason.</li>
          <li><strong>You see the result.</strong> Resolved complaints stay on your list with the final remark.</li>
        </ol>
      </section>

      <section className="demo">
        <h2>Try the demo accounts</h2>
        <p>Citizen: <code>citizen@civic.local</code> / <code>citizen123</code></p>
        <p>Admin: <code>admin@civic.local</code> / <code>admin123</code></p>
      </section>
    </>
  );
}
