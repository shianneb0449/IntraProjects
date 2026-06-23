export type TaskUrgency   = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus    = "Open" | "In Progress" | "Stalled" | "Waiting on response" | "Under review" | "Complete" | "Cancelled";
export type ApprovalStatus = "Pending review" | "Approved" | "Approved with conditions" | "Rejected" | "On hold — awaiting info";
export type ResourceLoad  = "25%" | "50%" | "75%" | "100%";
export type FinalStatus   = "Complete" | "Partially complete — remainder deferred" | "Cancelled";

export interface TaskFormStep1 {
  projectName: string; summary: string; requestor: string; requestorEmail: string;
  department: string; team: string; urgency: TaskUrgency;
  primaryResource: string; primaryResourceLoad: ResourceLoad; createdDate: string;
  secondaryResource: string; secondaryResourceLoad: ResourceLoad; dueDate: string;
  projectFolderDirectory: string; travelNeeded: boolean; scopeCreep: boolean; projectObjectiveGoal: string;
}
export interface TaskFormStep2 { approver: string; approvalStatus: ApprovalStatus; approvalComments: string; }
export interface TaskFormStep3 {
  status: TaskStatus; reminderDate: string; nextStepSummary: string;
  stalledBy: string; currentlyWaitingOn: string; stalledReason: string; reviewNeeded: boolean;
}
export interface TaskFormStep4 {
  dodRequirementsMet: boolean; dodTestingComplete: boolean; dodDocumentationUpdated: boolean;
  dodSubtasksClosed: boolean; dodStakeholdersNotified: boolean;
  completionNotes: string; finalStatus: FinalStatus;
}
export interface TaskFormValues extends TaskFormStep1, TaskFormStep2, TaskFormStep3, TaskFormStep4 {}

export interface TaskDto {
  taskId: number; taskNumber: string; charterId: number | null; charterNumber: string | null;
  projectName: string; summary: string; requestor: string; department: string;
  urgency: TaskUrgency; primaryResource: string; dueDate: string | null;
  status: TaskStatus; approvalStatus: ApprovalStatus;
  travelNeeded: boolean; scopeCreep: boolean; createdAt: string; createdByDisplayName: string;
}
