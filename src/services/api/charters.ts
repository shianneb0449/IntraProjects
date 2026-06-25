import { apiClient } from "./client";

export interface CharterListItem {
  charterId: number;
  charterNumber: string;
  title: string;
  department: string | null;
  status: string;
  statusCode: string;
  priority: string;
  priorityCode: string;
  ownerDisplayName: string;
  startDate: string | null;
  targetDate: string | null;
  isArchived: boolean;
  createdAt: string;
  taskCount: number;
  completedTaskCount: number;
}

export interface CharterDetail extends CharterListItem {
  description: string | null;
  problemStatement: string | null;
  goalStatement: string | null;
  projectApproach: string | null;
  modifiedAt: string;
  tasks: TaskSummary[];
}

export interface TaskSummary {
  taskId: number;
  taskNumber: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  requestor: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateCharterDto {
  title: string;
  department?: string;
  problemStatement?: string;
  goalStatement?: string;
  projectApproach?: string;
  ownerUserId: number;
  statusId: number;
  priorityId: number;
  startDate?: string;
  targetDate?: string;
}

export const chartersApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; pageSize?: number }) =>
    apiClient.get<PagedResult<CharterListItem>>("/api/charters", { params }).then(r => r.data),

  getById: (id: number) =>
    apiClient.get<CharterDetail>(`/api/charters/${id}`).then(r => r.data),

  create: (data: CreateCharterDto) =>
    apiClient.post<{ charterId: number; charterNumber: string }>("/api/charters", data).then(r => r.data),

  changeStatus: (id: number, statusId: number, changedByUserId: number, notes?: string) =>
    apiClient.patch(`/api/charters/${id}/status`, { statusId, changedByUserId, notes }).then(r => r.data),

  archive: (id: number, archivedByUserId: number, reason?: string) =>
    apiClient.delete(`/api/charters/${id}`, { data: { archivedByUserId, reason } }).then(r => r.data),
};
