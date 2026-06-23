import type { Priority, AuditMeta } from "./common";

export type TaskStatus =
  | "Not Started"
  | "In Progress"
  | "Blocked"
  | "Done";

export interface TaskDto {
  taskId: number;
  taskNumber: string;          // TSK-0188
  charterId: number;
  charterNumber: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assignedToUserId: number | null;
  assignedToDisplayName: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  subtaskCount: number;
  completedSubtaskCount: number;
  isArchived: boolean;
  audit: AuditMeta;
}
