import type { AuthUser, Complaint, ComplaintStatus, Notice, Stats, Category } from "./types";

const TOKEN_KEY = "civicconnect.user";

export function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
export function saveUser(user: AuthUser | null) {
  if (user) localStorage.setItem(TOKEN_KEY, JSON.stringify(user));
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const user = loadUser();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (user) headers.Authorization = `Bearer ${user.token}`;
  const res = await fetch(`/api${path}`, { ...options, headers });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  register: (b: { name: string; email: string; password: string; phone?: string }) =>
    request<AuthUser>("/auth/register", { method: "POST", body: JSON.stringify(b) }),
  login: (b: { email: string; password: string }) =>
    request<AuthUser>("/auth/login", { method: "POST", body: JSON.stringify(b) }),
  stats: () => request<Stats>("/public/stats"),
  notices: () => request<Notice[]>("/notices"),
  addNotice: (b: { title: string; body: string }) =>
    request<Notice>("/notices", { method: "POST", body: JSON.stringify(b) }),
  deleteNotice: (id: number) => request<void>(`/notices/${id}`, { method: "DELETE" }),
  createComplaint: (b: { title: string; description: string; category: Category; ward: string; address?: string }) =>
    request<Complaint>("/complaints", { method: "POST", body: JSON.stringify(b) }),
  myComplaints: () => request<Complaint[]>("/complaints/mine"),
  allComplaints: (status?: ComplaintStatus) =>
    request<Complaint[]>(`/admin/complaints${status ? `?status=${status}` : ""}`),
  updateStatus: (id: number, status: ComplaintStatus, remark: string) =>
    request<Complaint>(`/admin/complaints/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, remark }) }),
};
