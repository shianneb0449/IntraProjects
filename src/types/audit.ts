export type AuditActionType = "Created" | "Updated" | "StatusChanged" | "Assigned" | "Archived";
export interface AuditEventDto {
  auditEventId: number; eventId: string; entityType: "Charter" | "Task" | "Subtask";
  entityId: number; entityDisplayId: string; actionType: AuditActionType;
  fieldName: string | null; oldValue: string | null; newValue: string | null;
  changedByDisplayName: string; changedByInitials: string; changedAt: string;
}
