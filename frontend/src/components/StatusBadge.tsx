import { STATUS_LABELS, type ComplaintStatus } from "../types";

export default function StatusBadge({ status }: { status: ComplaintStatus }) {
  return <span className={`badge ${status.toLowerCase()}`}>{STATUS_LABELS[status]}</span>;
}
