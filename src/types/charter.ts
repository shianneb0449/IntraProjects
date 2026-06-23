import type { Priority, AuditMeta } from "./common";

export type CharterStatus =
  | "Planning"
  | "Active"
  | "On Hold"
  | "Completed"
  | "Cancelled";

export interface CharterDto {
  charterId: number;
  charterNumber: string;       // CHR-0041
  title: string;
  description: string | null;
  department: string | null;
  ownerUserId: number;
  ownerDisplayName: string;
  status: CharterStatus;
  priority: Priority;
  startDate: string | null;
  targetDate: string | null;
  taskCount: number;
  completedTaskCount: number;
  progressPercent: number;
  isArchived: boolean;
  audit: AuditMeta;
}

export interface CreateCharterRequest {
  title: string;
  description?: string;
  department?: string;
  ownerUserId: number;
  priorityCode: Priority;
  startDate?: string;
  targetDate?: string;
}

export interface UpdateCharterRequest extends CreateCharterRequest {
  charterId: number;
}

export interface ChangeCharterStatusRequest {
  statusCode: CharterStatus;
  notes?: string;
}

export interface CharterQueryParams {
  pageNumber?: number;
  pageSize?: number;
  status?: CharterStatus;
  search?: string;
  ownerUserId?: number;
}
