export type Priority = "Critical" | "High" | "Medium" | "Low";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface AuditMeta {
  createdAt: string;
  createdByDisplayName: string;
  modifiedAt: string;
  modifiedByDisplayName: string;
}
