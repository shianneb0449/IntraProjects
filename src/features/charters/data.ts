import type { CharterStatus } from "../../types/charter";
import type { Priority } from "../../types/common";

// Shared mock data — replaced by API calls in v1.0.0
export interface MockCharter {
  id: string;
  title: string;
  owner: string;
  ownerInitials: string;
  status: CharterStatus;
  priority: Priority;
  progress: number;
  taskCount: number;
  completedTasks: number;
  startDate: string;
  targetDate: string;
  department: string;
}

export const MOCK_CHARTERS: MockCharter[] = [
  { id: "CHR-0041", title: "ERP System Migration — Phase 3", owner: "S. Burnett", ownerInitials: "SB", status: "Active", priority: "Critical", progress: 67, taskCount: 24, completedTasks: 16, startDate: "2026-01-15", targetDate: "2026-07-31", department: "IT Infrastructure" },
  { id: "CHR-0039", title: "Vendor Onboarding Automation", owner: "M. Delacroix", ownerInitials: "MD", status: "Active", priority: "High", progress: 42, taskCount: 18, completedTasks: 7, startDate: "2026-02-01", targetDate: "2026-09-15", department: "Procurement" },
  { id: "CHR-0037", title: "HR Policy Framework Refresh", owner: "T. Okafor", ownerInitials: "TO", status: "Planning", priority: "Medium", progress: 12, taskCount: 31, completedTasks: 4, startDate: "2026-03-10", targetDate: "2026-12-01", department: "Human Resources" },
  { id: "CHR-0035", title: "Data Center Consolidation", owner: "A. Patel", ownerInitials: "AP", status: "On Hold", priority: "High", progress: 55, taskCount: 14, completedTasks: 8, startDate: "2025-11-01", targetDate: "2026-06-30", department: "IT Infrastructure" },
  { id: "CHR-0033", title: "ISO 27001 Certification Program", owner: "R. Huang", ownerInitials: "RH", status: "Active", priority: "Critical", progress: 88, taskCount: 42, completedTasks: 37, startDate: "2025-09-01", targetDate: "2026-06-30", department: "Compliance" },
  { id: "CHR-0029", title: "Customer Portal Redesign", owner: "L. Fontaine", ownerInitials: "LF", status: "Completed", priority: "Medium", progress: 100, taskCount: 22, completedTasks: 22, startDate: "2025-07-01", targetDate: "2026-01-31", department: "Digital" },
];

export const MOCK_AUDIT = [
  { id: "AUD-2094", user: "S. Burnett", initials: "SB", action: "Updated status", entityId: "TSK-0188", changeType: "status" as const, timestamp: "Today 14:32" },
  { id: "AUD-2093", user: "R. Huang",   initials: "RH", action: "Assigned to",    entityId: "SUB-0441", changeType: "assigned" as const, timestamp: "Today 13:15" },
  { id: "AUD-2092", user: "M. Delacroix",initials: "MD", action: "Created charter",entityId: "CHR-0042", changeType: "created" as const, timestamp: "Today 11:04" },
  { id: "AUD-2091", user: "T. Okafor",  initials: "TO", action: "Modified field",  entityId: "TSK-0172", changeType: "updated" as const, timestamp: "Today 10:47" },
  { id: "AUD-2090", user: "A. Patel",   initials: "AP", action: "Status changed",  entityId: "CHR-0035", changeType: "status" as const, timestamp: "Yesterday 17:22" },
  { id: "AUD-2089", user: "L. Fontaine",initials: "LF", action: "Completed task",  entityId: "TSK-0165", changeType: "status" as const, timestamp: "Yesterday 16:05" },
];
