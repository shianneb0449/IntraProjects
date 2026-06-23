import type { Priority, AuditMeta } from "./common";

export type SubtaskStatus =
  | "Not Started"
  | "In Progress"
  | "Blocked"
  | "Done";

export interface SubtaskDto {
  subtaskId: number;
  subtaskNumber: string;       // SUB-0441
  taskId: number;
  taskNumber: string;
  charterId: number;
  charterNumber: string;
  title: string;
  description: string | null;
  status: SubtaskStatus;
  priority: Priority;
  assignedToUserId: number | null;
  assignedToDisplayName: string | null;
  dueDate: string | null;
  completedDate: string | null;
  isArchived: boolean;
  audit: AuditMeta;
}
