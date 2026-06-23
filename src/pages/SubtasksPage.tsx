import { useState } from "react";
import { SubtaskForm } from "../features/subtasks/components/SubtaskForm";
import type { SubtaskFormValues } from "../types/subtask";

type View = "list" | "new";

const MOCK_SUBTASKS = [
  { id: "SUB-0441", charterNumber: "CHR-0041", charterTitle: "ERP System Migration — Phase 3", taskNumber: "TSK-0188", taskSummary: "Configure SSO integration with AD", summary: "Set up LDAP connection string and test with dev environment", requestor: "S. Burnett", urgency: "High",     status: "In Progress", dueDate: "2026-07-10" },
  { id: "SUB-0440", charterNumber: "CHR-0033", charterTitle: "ISO 27001 Certification Program", taskNumber: "TSK-0187", taskSummary: "Complete risk assessment documentation", summary: "Document data classification policy for all server infrastructure", requestor: "R. Huang",   urgency: "Critical",  status: "Open",        dueDate: "2026-06-27" },
  { id: "SUB-0439", charterNumber: "CHR-0041", charterTitle: "ERP System Migration — Phase 3", taskNumber: "TSK-0184", taskSummary: "Data migration dry run for Finance module", summary: "Export legacy GL data and validate row counts", requestor: "A. Patel",   urgency: "High",     status: "Stalled",     dueDate: "2026-07-18" },
  { id: "SUB-0438", charterNumber: "CHR-0039", charterTitle: "Vendor Onboarding Automation",   taskNumber: "TSK-0186", taskSummary: "Build API connector for vendor portal", summary: "Write OAuth2 authentication middleware for vendor API", requestor: "M. Delacroix", urgency: "Medium",   status: "Open",        dueDate: "2026-07-30" },
  { id: "SUB-0437", charterNumber: "CHR-0033", charterTitle: "ISO 27001 Certification Program", taskNumber: "TSK-0187", taskSummary: "Complete risk assessment documentation", summary: "Review and sign off on third-party vendor access controls", requestor: "R. Huang",   urgency: "High",     status: "Under review",dueDate: "2026-06-30" },
];

const urgencyColor: Record<string, string> = {
  Critical: "text-red-400 bg-red-400/10",
  High:     "text-orange-400 bg-orange-400/10",
  Medium:   "text-amber-400 bg-amber-400/10",
  Low:      "text-slate-400 bg-slate-400/10",
};
const statusColor: Record<string, string> = {
  "Open":                 "text-slate-400 bg-slate-400/10",
  "In Progress":          "text-emerald-400 bg-emerald-400/10",
  "Stalled":              "text-amber-400 bg-amber-400/10",
  "Waiting on response":  "text-amber-400 bg-amber-400/10",
  "Under review":         "text-blue-400 bg-blue-400/10",
  "Complete":             "text-blue-400 bg-blue-400/10",
  "Cancelled":            "text-red-400 bg-red-400/10",
};

export function SubtasksPage() {
  const [view, setView] = useState<View>("list");
  const [subtasks, setSubtasks] = useState(MOCK_SUBTASKS);
  const [filterCharter, setFilterCharter] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  function handleCreate(data: SubtaskFormValues) {
    const newId = `SUB-${String(subtasks.length + 450).padStart(4, "0")}`;
    const charter = MOCK_SUBTASKS.find(s => s.charterNumber === data.charterNumber);
    setSubtasks(prev => [...prev, {
      id: newId,
      charterNumber: data.charterNumber,
      charterTitle: charter?.charterTitle ?? data.charterNumber,
      taskNumber: data.taskNumber,
      taskSummary: data.taskNumber,
      summary: data.summary,
      requestor: data.requestor,
      urgency: data.urgency,
      status: data.status,
      dueDate: data.dueDate || "—",
    }]);
    setView("list");
  }

  if (view === "new") {
    return (
      <div className="flex flex-col h-full">
        <SubtaskForm onClose={() => setView("list")} onSubmit={handleCreate} />
      </div>
    );
  }

  // Unique charters for filter
  const charterOptions = [...new Set(subtasks.map(s => s.charterNumber))];
  const statusOptions  = [...new Set(subtasks.map(s => s.status))];

  const filtered = subtasks.filter(s => {
    const matchCharter = filterCharter === "All" || s.charterNumber === filterCharter;
    const matchStatus  = filterStatus  === "All" || s.status === filterStatus;
    return matchCharter && matchStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Subtasks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Linked to a Project Task and Project Charter
          </p>
        </div>
        <button
          onClick={() => setView("new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New Subtask
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",       value: subtasks.length },
          { label: "Open",        value: subtasks.filter(s => s.status === "Open").length },
          { label: "In Progress", value: subtasks.filter(s => s.status === "In Progress").length },
          { label: "Stalled",     value: subtasks.filter(s => s.status === "Stalled").length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <div className="text-2xl font-semibold text-foreground font-mono">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Charter:</span>
          <select
            value={filterCharter}
            onChange={e => setFilterCharter(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="All">All charters</option>
            {charterOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="All">All statuses</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{filtered.length} subtasks</span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Summary", "Charter", "Task", "Requestor", "Urgency", "Status", "Due"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No subtasks match your filters.
                </td>
              </tr>
            )}
            {filtered.map((s, i) => (
              <tr key={s.id} className={`hover:bg-white/[0.03] transition-colors ${i < filtered.length - 1 ? "border-b border-border" : ""}`}>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{s.id}</td>
                <td className="px-4 py-3 font-medium text-foreground max-w-[220px]">
                  <div className="truncate text-sm">{s.summary}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-xs text-primary font-mono">{s.charterNumber}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px] truncate">{s.charterTitle}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-xs text-primary/70 font-mono">{s.taskNumber}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px] truncate">{s.taskSummary}</div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{s.requestor}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono ${urgencyColor[s.urgency]}`}>{s.urgency}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono ${statusColor[s.status] ?? "text-slate-400 bg-slate-400/10"}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{s.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
