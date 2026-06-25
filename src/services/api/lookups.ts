import { apiClient } from "./client";

export interface StatusOption {
  statusId: number;
  statusCode: string;
  displayName: string;
  isTerminal: boolean;
}

export interface PriorityOption {
  priorityId: number;
  priorityCode: string;
  displayName: string;
  colorHex: string | null;
}

export const lookupsApi = {
  charterStatuses: () =>
    apiClient.get<StatusOption[]>("/api/lookups/charter-statuses").then(r => r.data),

  taskStatuses: () =>
    apiClient.get<StatusOption[]>("/api/lookups/task-statuses").then(r => r.data),

  subtaskStatuses: () =>
    apiClient.get<StatusOption[]>("/api/lookups/subtask-statuses").then(r => r.data),

  priorities: () =>
    apiClient.get<PriorityOption[]>("/api/lookups/priorities").then(r => r.data),
};
