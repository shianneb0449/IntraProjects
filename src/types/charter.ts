import type { Priority } from "./common";

export type CharterStatus = "Draft" | "Active" | "On Hold" | "Completed" | "Cancelled";
export type ProjectApproach = "Waterfall" | "Agile / Iterative" | "Phased" | "Pilot then Rollout" | "Other";

export interface ProjectTeamMember { name: string; role: string; estimatedHours: number; }
export interface CostItem { description: string; amount: number; }
export interface ProjectMilestone { milestoneNumber: number; description: string; completeByDate: string; }
export interface VendorSummary { vendorName: string; productName: string; oneTimeCosts: number; annualPrice: number; firstYearTotal: number; threeYearForecast: number; totalWithTax: number; notes: string; }
export interface VendorEvaluation { pros: string[]; cons: string[]; references: Array<{ contact: string; contactInfo: string }>; }

export interface CharterFormValues {
  projectName: string; problemStatement: string; goalStatement: string;
  projectLeader: string; projectApproach: ProjectApproach | "";
  startDate: string; estimatedCompletionDate: string; hasVendor: boolean;
  vendorName: string; productName: string; oneTimeCosts: string; annualPrice: string; vendorNotes: string;
}

export interface CharterDto {
  charterId: number; charterNumber: string; projectName: string;
  problemStatement: string; goalStatement: string; projectLeader: string;
  projectApproach: string; status: CharterStatus; priority: Priority;
  startDate: string | null; estimatedCompletionDate: string | null;
  hasVendor: boolean; teamMemberCount: number; milestoneCount: number;
  isArchived: boolean; createdAt: string; createdByDisplayName: string;
}
