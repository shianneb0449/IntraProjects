import { apiClient } from "./client";
import type { AuditEventDto } from "../../types/audit";
import type { PagedResult } from "../../types/common";

export interface AuditQueryParams {
  pageNumber?: number;
  pageSize?: number;
  entityType?: "Charter" | "Task" | "Subtask";
  userId?: number;
  actionType?: string;
  from?: string;
  to?: string;
}

export const auditApi = {
  getAll: (params?: AuditQueryParams) =>
    apiClient
      .get<PagedResult<AuditEventDto>>("/api/audit", { params })
      .then((r) => r.data),
};
