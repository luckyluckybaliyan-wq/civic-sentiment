export type Role = "CITIZEN" | "ADMIN";
export type ComplaintStatus = "SUBMITTED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
export type Category =
  | "ROAD" | "WATER_SUPPLY" | "SANITATION" | "STREET_LIGHT"
  | "DRAINAGE" | "GARBAGE" | "PARK" | "OTHER";

export interface AuthUser { token: string; id: number; name: string; email: string; role: Role }

export interface Complaint {
  id: number; title: string; description: string; category: Category; ward: string;
  address?: string; status: ComplaintStatus; adminRemark?: string;
  createdAt: string; updatedAt: string; citizenName: string;
}

export interface Notice { id: number; title: string; body: string; publishedAt: string }
export interface Stats { total: number; submitted: number; inProgress: number; resolved: number; rejected: number }

export const CATEGORY_LABELS: Record<Category, string> = {
  ROAD: "Roads and potholes", WATER_SUPPLY: "Water supply", SANITATION: "Sanitation",
  STREET_LIGHT: "Street lights", DRAINAGE: "Drainage", GARBAGE: "Garbage collection",
  PARK: "Parks and gardens", OTHER: "Other",
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  SUBMITTED: "Submitted", IN_PROGRESS: "In progress", RESOLVED: "Resolved", REJECTED: "Rejected",
};
