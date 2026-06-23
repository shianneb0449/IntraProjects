import { MOCK_CHARTERS } from "../charters/data";
import { MOCK_ASSIGNMENTS } from "../assignments/data";

// ── Charter status ────────────────────────────────────────────────────────────
export const charterStatusData = (() => {
  const counts: Record<string, number> = {};
  MOCK_CHARTERS.forEach(c => { counts[c.status] = (counts[c.status] ?? 0) + 1; });
  const colors: Record<string, string> = {
    Active: "#34d399", Planning: "#94a3b8", "On Hold": "#fbbf24",
    Completed: "#60a5fa", Cancelled: "#f87171",
  };
  return Object.entries(counts).map(([status, count]) => ({
    status, count, color: colors[status] ?? "#94a3b8",
  }));
})();

// ── Charter progress ──────────────────────────────────────────────────────────
export const charterProgressData = MOCK_CHARTERS.map(c => ({
  id: c.id,
  name: c.title.length > 30 ? c.title.slice(0, 28) + "…" : c.title,
  fullTitle: c.title,
  progress: c.progress,
  completed: c.completedTasks,
  total: c.taskCount,
  status: c.status,
  owner: c.owner,
  targetDate: c.targetDate,
}));

// ── Task completion by charter ────────────────────────────────────────────────
export const taskCompletionData = MOCK_CHARTERS.map(c => ({
  name: c.id,
  title: c.title,
  total: c.taskCount,
  completed: c.completedTasks,
  open: c.taskCount - c.completedTasks,
  rate: c.taskCount > 0 ? Math.round((c.completedTasks / c.taskCount) * 100) : 0,
}));

// ── Resource workload ─────────────────────────────────────────────────────────
export const resourceWorkloadData = (() => {
  const people: Record<string, { name: string; initials: string; role: string; items: number; load: number }> = {};
  MOCK_ASSIGNMENTS.forEach(a => {
    if (!people[a.personName]) {
      people[a.personName] = { name: a.personName, initials: a.personInitials, role: a.personRole, items: 0, load: 0 };
    }
    people[a.personName].items += 1;
    people[a.personName].load += a.resourceRole === "Primary" ? a.load : a.load / 2;
  });
  return Object.values(people).sort((a, b) => b.load - a.load);
})();

// ── Overdue / at-risk ─────────────────────────────────────────────────────────
export const atRiskData = [
  { id: "TSK-0187", type: "Task",    summary: "Complete risk assessment documentation",        charter: "CHR-0033", urgency: "Critical", status: "Under review",  dueDate: "2026-06-28", resource: "R. Huang",     risk: "Overdue" },
  { id: "SUB-0440", type: "Subtask", summary: "Document data classification policy",           charter: "CHR-0033", urgency: "Critical", status: "Open",          dueDate: "2026-06-27", resource: "R. Huang",     risk: "Overdue" },
  { id: "SUB-0437", type: "Subtask", summary: "Review third-party vendor access controls",     charter: "CHR-0033", urgency: "High",     status: "Under review",  dueDate: "2026-06-30", resource: "R. Huang",     risk: "Due soon" },
  { id: "TSK-0185", type: "Task",    summary: "Draft updated remote work policy",              charter: "CHR-0037", urgency: "Low",      status: "Stalled",       dueDate: "2026-09-15", resource: "T. Okafor",    risk: "Stalled" },
  { id: "SUB-0439", type: "Subtask", summary: "Export legacy GL data and validate row counts", charter: "CHR-0041", urgency: "High",     status: "Stalled",       dueDate: "2026-07-18", resource: "A. Patel",     risk: "Stalled" },
  { id: "TSK-0184", type: "Task",    summary: "Data migration dry run for Finance module",     charter: "CHR-0041", urgency: "High",     status: "Open",          dueDate: "2026-07-20", resource: "A. Patel",     risk: "At risk" },
];

// ── Milestones ────────────────────────────────────────────────────────────────
export const milestoneData = [
  { charter: "CHR-0033", charterTitle: "ISO 27001 Certification",       no: 1, description: "Risk assessment complete",           dueDate: "2026-06-25", status: "Overdue"   },
  { charter: "CHR-0033", charterTitle: "ISO 27001 Certification",       no: 2, description: "Internal audit complete",            dueDate: "2026-07-10", status: "Upcoming"  },
  { charter: "CHR-0033", charterTitle: "ISO 27001 Certification",       no: 3, description: "External certification audit",       dueDate: "2026-07-30", status: "Upcoming"  },
  { charter: "CHR-0041", charterTitle: "ERP Migration — Phase 3",       no: 1, description: "AD / SSO integration signed off",    dueDate: "2026-07-15", status: "Upcoming"  },
  { charter: "CHR-0041", charterTitle: "ERP Migration — Phase 3",       no: 2, description: "Finance module data migration",      dueDate: "2026-07-31", status: "Upcoming"  },
  { charter: "CHR-0041", charterTitle: "ERP Migration — Phase 3",       no: 3, description: "UAT sign-off",                       dueDate: "2026-08-15", status: "Upcoming"  },
  { charter: "CHR-0039", charterTitle: "Vendor Onboarding Automation",  no: 1, description: "API connector complete",             dueDate: "2026-08-01", status: "Upcoming"  },
  { charter: "CHR-0039", charterTitle: "Vendor Onboarding Automation",  no: 2, description: "Vendor portal go-live",              dueDate: "2026-09-15", status: "Upcoming"  },
  { charter: "CHR-0037", charterTitle: "HR Policy Framework Refresh",   no: 1, description: "Policy drafts reviewed",            dueDate: "2026-08-01", status: "At risk"   },
  { charter: "CHR-0037", charterTitle: "HR Policy Framework Refresh",   no: 2, description: "Leadership sign-off",               dueDate: "2026-10-01", status: "Upcoming"  },
];
