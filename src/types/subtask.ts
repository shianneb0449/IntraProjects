export type SubtaskUrgency   = "Low" | "Medium" | "High" | "Critical";
export type SubtaskStatus    = "Open" | "In Progress" | "Stalled" | "Waiting on response" | "Under review" | "Complete" | "Cancelled";
export type SubtaskApprovalStatus = "Pending review" | "Approved" | "Approved with conditions" | "Rejected" | "On hold — awaiting info";
export type SubtaskResourceLoad  = "25%" | "50%" | "75%" | "100%";
export type SubtaskFinalStatus   = "Complete" | "Partially complete — remainder deferred" | "Cancelled";

export interface SubtaskFormStep1 {
  charterNumber: string; taskNumber: string; summary: string; requestor: string; requestorEmail: string;
  department: string; team: string; urgency: SubtaskUrgency;
  primaryResource: string; primaryResourceLoad: SubtaskResourceLoad; createdDate: string;
  secondaryResource: string; secondaryResourceLoad: SubtaskResourceLoad; dueDate: string;
  projectFolderDirectory: string; travelNeeded: boolean; scopeCreep: boolean; projectObjectiveGoal: string;
}
export interface SubtaskFormStep2 { approver: string; approvalStatus: SubtaskApprovalStatus; approvalComments: string; }
export interface SubtaskFormStep3 {
  status: SubtaskStatus; reminderDate: string; nextStepSummary: string;
  stalledBy: string; currentlyWaitingOn: string; stalledReason: string; reviewNeeded: boolean;
}
export interface SubtaskFormStep4 {
  dodRequirementsMet: boolean; dodTestingComplete: boolean; dodDocumentationUpdated: boolean;
  dodSubtasksClosed: boolean; dodStakeholdersNotified: boolean;
  completionNotes: string; finalStatus: SubtaskFinalStatus;
}
export interface SubtaskFormValues extends SubtaskFormStep1, SubtaskFormStep2, SubtaskFormStep3, SubtaskFormStep4 {}
