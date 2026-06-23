import { apiClient } from "./client";
import type {
  CharterDto,
  CreateCharterRequest,
  UpdateCharterRequest,
  ChangeCharterStatusRequest,
  CharterQueryParams,
} from "../../types/charter";
import type { PagedResult } from "../../types/common";
import type { AuditEventDto } from "../../types/audit";

export const chartersApi = {
  getAll: (params?: CharterQueryParams) =>
    apiClient
      .get<PagedResult<CharterDto>>("/api/charters", { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<CharterDto>(`/api/charters/${id}`).then((r) => r.data),

  create: (data: CreateCharterRequest) =>
    apiClient.post<CharterDto>("/api/charters", data).then((r) => r.data),

  update: (id: number, data: UpdateCharterRequest) =>
    apiClient.put<CharterDto>(`/api/charters/${id}`, data).then((r) => r.data),

  changeStatus: (id: number, data: ChangeCharterStatusRequest) =>
    apiClient
      .patch(`/api/charters/${id}/status`, data)
      .then((r) => r.data),

  archive: (id: number, reason?: string) =>
    apiClient
      .delete(`/api/charters/${id}`, { data: { reason } })
      .then((r) => r.data),

  getAuditHistory: (id: number) =>
    apiClient
      .get<AuditEventDto[]>(`/api/charters/${id}/audit`)
      .then((r) => r.data),
};
