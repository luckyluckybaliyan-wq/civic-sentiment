import type { ReactNode } from "react";
import { CATEGORY_LABELS, type Complaint } from "../types";
import StatusBadge from "./StatusBadge";

export default function ComplaintCard({ c, children }: { c: Complaint; children?: ReactNode }) {
  return (
    <article className={`ticket ${c.status.toLowerCase()}`}>
      <div className="ticket-head">
        <h3>{c.title}</h3>
        <StatusBadge status={c.status} />
      </div>
      <p>{c.description}</p>
      <dl className="meta">
        <div><dt>Category</dt><dd>{CATEGORY_LABELS[c.category]}</dd></div>
        <div><dt>Ward</dt><dd>{c.ward}</dd></div>
        {c.address && <div><dt>Location</dt><dd>{c.address}</dd></div>}
        <div><dt>Filed</dt><dd>{new Date(c.createdAt).toLocaleDateString()}</dd></div>
        <div><dt>Filed by</dt><dd>{c.citizenName}</dd></div>
      </dl>
      {c.adminRemark && <p className="remark"><strong>Update from the municipality:</strong> {c.adminRemark}</p>}
      {children}
    </article>
  );
}
