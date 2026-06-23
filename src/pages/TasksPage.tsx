import { useState } from "react";
import { TaskForm } from "../features/tasks/components/TaskForm";
import type { TaskFormValues } from "../types/task";

type View = "list" | "new";

// Mock tasks data — replaced by API in v1.1.0
const MOCK_TASKS = [
  { id: "TSK-0188", project: "ERP System Migration — Phase 3", summary: "Configure SSO integration with Active Directory", requestor: "S. Burnett", urgency: "High", status: "In Progress", dueDate: "2026-07-15" },
  { id: "TSK-0187", project: "ISO 27001 Certification Program", summary: "Complete risk assessment documentation for all systems", requestor: "R. Huang", urgency: "Critical", status: "Under review", dueDate: "2026-06-28" },
  { id: "TSK-0186", project: "Vendor Onboarding Automation", summary: "Build API connector for vendor portal", requestor: "M. Delacroix", urgency: "Medium", status: "Open", dueDate: "2026-08-01" },
  { id: "TSK-0185", project: "HR Policy Framework Refresh", summary: "Draft updated remote work policy", requestor: "T. Okafor", urgency: "Low", status: "Stalled", dueDate: "2026-09-15" },
  { id: "TSK-0184", project: "ERP System Migration — Phase 3", summary: "Data migration dry run for Finance module", requestor: "A. Patel", urgency: "High", status: "Open", dueDate: "2026-07-20" },
];

const urgencyColor: Record<string, string> = {
  Critical: "text-red-400 bg-red-400/10",
  High:     "text-orange-400 bg-orange-400/10",
  Medium:   "text-amber-400 bg-amber-400/10",
  Low:      "text-slate-400 bg-slate-400/10",
};
const statusColor: Record<string, string> = {
  "Open":           "text-slate-400 bg-slate-400/10",
  "In Progress":    "text-emerald-400 bg-emerald-400/10",
  "Stalled":        "text-amber-400 bg-amber-400/10",
  "Waiting on response": "text-amber-400 bg-amber-400/10",
  "Under review":   "text-blue-400 bg-blue-400/10",
  "Complete":       "text-blue-400 bg-blue-400/10",
  "Cancelled":      "text-red-400 bg-red-400/10",
};

export function TasksPage() {
  const [view, setView] = useState<View>("list");
  const [tasks, setTasks] = useState(MOCK_TASKS);

  function handleCreate(data: TaskFormValues) {
    const newId = `TSK-${String(tasks.length + 200).padStart(4, "0")}`;
    setTasks(prev => [...prev, {
      id: newId,
      project: data.projectName,
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
        <TaskForm onClose={() => setView("list")} onSubmit={handleCreate} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Project Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Work items linked to project charters
          </p>
        </div>
        <button
          onClick={() => setView("new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New Task
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Task ID", "Summary", "Project", "Requestor", "Urgency", "Status", "Due Date"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={t.id} className={`hover:bg-white/[0.03] transition-colors ${i < tasks.length - 1 ? "border-b border-border" : ""}`}>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{t.id}</td>
                <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">{t.summary}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.project}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{t.requestor}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono ${urgencyColor[t.urgency]}`}>{t.urgency}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono ${statusColor[t.status] ?? "text-slate-400 bg-slate-400/10"}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{t.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
