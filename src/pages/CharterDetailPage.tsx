import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft, Edit2, Archive, ChevronRight,
  Users, Flag, Building2, CalendarDays, TrendingUp,
  CheckCircle2, Circle, PauseCircle, AlertTriangle,
  ClipboardList, MoreHorizontal,
} from "lucide-react";
import { useData } from "../contexts/DataContext";

// ── Status badge ──────────────────────────────────────────────────────────────
const statusCfg: Record<string, { color: string; bg: string; Icon: React.ElementType }> = {
  Active:     { color: "text-emerald-400", bg: "bg-emerald-400/10", Icon: CheckCircle2 },
  "On Hold":  { color: "text-amber-400",   bg: "bg-amber-400/10",   Icon: PauseCircle  },
  Planning:   { color: "text-slate-400",   bg: "bg-slate-400/10",   Icon: Circle       },
  Draft:      { color: "text-slate-400",   bg: "bg-slate-400/10",   Icon: Circle       },
  Completed:  { color: "text-blue-400",    bg: "bg-blue-400/10",    Icon: CheckCircle2 },
  Cancelled:  { color: "text-red-400",     bg: "bg-red-400/10",     Icon: AlertTriangle},
};
const priColor: Record<string, string> = {
  Critical: "text-red-400", High: "text-orange-400", Medium: "text-amber-400", Low: "text-slate-400",
};
const urgencyColor: Record<string, string> = {
  Critical: "text-red-400 bg-red-400/10", High: "text-orange-400 bg-orange-400/10",
  Medium: "text-amber-400 bg-amber-400/10", Low: "text-slate-400 bg-slate-400/10",
};
const taskStatusColor: Record<string, string> = {
  "Open": "text-slate-400 bg-slate-400/10", "In Progress": "text-emerald-400 bg-emerald-400/10",
  "Stalled": "text-amber-400 bg-amber-400/10", "Under review": "text-blue-400 bg-blue-400/10",
  "Complete": "text-blue-400 bg-blue-400/10", "Cancelled": "text-red-400 bg-red-400/10",
};
const milestoneColor: Record<string, string> = {
  Overdue: "text-red-400 bg-red-400/10", "At risk": "text-orange-400 bg-orange-400/10",
  Upcoming: "text-blue-400 bg-blue-400/10", Complete: "text-emerald-400 bg-emerald-400/10",
};
const milestoneDot: Record<string, string> = {
  Overdue: "bg-red-400", "At risk": "bg-orange-400", Upcoming: "bg-blue-400", Complete: "bg-emerald-400",
};

const TABS = ["Overview", "Tasks", "Milestones"];

function pcol(v: number) {
  return v === 100 ? "bg-blue-400" : v >= 60 ? "bg-emerald-400" : v >= 30 ? "bg-amber-400" : "bg-red-400";
}

export function CharterDetailPage() {
  const { charterId } = useParams<{ charterId: string }>();
  const navigate = useNavigate();
  const { getCharter, getCharterTasks, getCharterMilestones } = useData();
  const [tab, setTab] = useState(0);

  const charter = getCharter(charterId ?? "");

  if (!charter) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-4 opacity-20">?</div>
        <div className="text-sm text-muted-foreground">
          Charter <span className="font-mono text-primary">{charterId}</span> not found.
        </div>
        <button onClick={() => navigate("/charters")} className="mt-4 text-xs text-primary hover:opacity-75">
          ← Back to charters
        </button>
      </div>
    );
  }

  const tasks = getCharterTasks(charter.id);
  const milestones = getCharterMilestones(charter.id);
  const sc = statusCfg[charter.status] ?? statusCfg.Planning;
  const StatusIcon = sc.Icon;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="px-6 py-5 border-b border-border flex-shrink-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <button onClick={() => navigate("/charters")} className="hover:text-foreground transition-colors">
            Project Charters
          </button>
          <ChevronRight size={12} />
          <span className="text-foreground font-mono">{charter.id}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <button
              onClick={() => navigate("/charters")}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mt-0.5 flex-shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">{charter.id}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium font-mono ${sc.color} ${sc.bg}`}>
                  <StatusIcon size={11} />
                  {charter.status}
                </span>
                <span className={`text-xs font-medium font-mono ${priColor[charter.priority]}`}>
                  ● {charter.priority}
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-foreground mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {charter.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={12} />
                  <span>{charter.owner}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 size={12} />
                  <span>{charter.department}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays size={12} />
                  <span>Target: {charter.targetDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Edit2 size={12} /> Edit
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Archive size={12} /> Archive
            </button>
            <button className="p-2 bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mt-4 pl-9">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-sm">
            <div className={`h-full rounded-full ${pcol(charter.progress)}`} style={{ width: `${charter.progress}%` }} />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{charter.progress}% complete</span>
          <span className="text-xs text-muted-foreground font-mono">{charter.completedTasks}/{charter.taskCount} tasks</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-border flex-shrink-0 px-6" style={{ background: "var(--card)" }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              tab === i ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t}
            {t === "Tasks" && tasks.length > 0 && (
              <span className="ml-2 text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{tasks.length}</span>
            )}
            {t === "Milestones" && milestones.length > 0 && (
              <span className="ml-2 text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{milestones.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* Overview tab */}
        {tab === 0 && (
          <div className="max-w-3xl">
            {/* Key metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Tasks",     value: `${charter.completedTasks}/${charter.taskCount}`, sub: "completed" },
                { label: "Progress",  value: `${charter.progress}%`,  sub: "overall" },
                { label: "Milestones",value: String(milestones.length), sub: "total" },
                { label: "Start",     value: charter.startDate || "—",  sub: "date" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
                  <div className="text-xl font-semibold text-foreground font-mono">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  <div className="text-[10px] text-muted-foreground opacity-70 font-mono">{sub}</div>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="bg-card border border-border rounded-lg p-5 mb-5">
              <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Charter Details</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "Charter ID",   value: charter.id },
                  { label: "Owner",        value: charter.owner },
                  { label: "Department",   value: charter.department },
                  { label: "Priority",     value: charter.priority },
                  { label: "Status",       value: charter.status },
                  { label: "Start date",   value: charter.startDate || "—" },
                  { label: "Target close", value: charter.targetDate || "—" },
                  { label: "Progress",     value: `${charter.progress}%` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">{label}</div>
                    <div className="text-sm text-foreground mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick task summary */}
            {tasks.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent Tasks</h3>
                  <button onClick={() => setTab(1)} className="text-xs text-primary hover:opacity-75">View all →</button>
                </div>
                <div className="space-y-2">
                  {tasks.slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                        <span className="text-sm text-foreground">{t.summary}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${taskStatusColor[t.status] ?? "text-slate-400 bg-slate-400/10"}`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tasks tab */}
        {tab === 1 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Tasks for {charter.id}
              </h3>
              <button
                onClick={() => navigate("/tasks")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                + New Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <ClipboardList size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <div className="text-sm text-muted-foreground">No tasks linked to this charter yet.</div>
                <button onClick={() => navigate("/tasks")} className="mt-3 text-xs text-primary hover:opacity-75">
                  Create first task →
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Task ID", "Summary", "Requestor", "Resource", "Load", "Urgency", "Status", "Due Date"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, i) => (
                      <tr key={t.id} className={`hover:bg-white/[0.02] transition-colors ${i < tasks.length - 1 ? "border-b border-border" : ""}`}>
                        <td className="px-4 py-3 text-xs font-mono text-primary/80">{t.id}</td>
                        <td className="px-4 py-3 text-sm text-foreground max-w-[220px] truncate">{t.summary}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{t.requestor}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{t.primaryResource}</td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.load}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${urgencyColor[t.urgency]}`}>{t.urgency}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${taskStatusColor[t.status] ?? "text-slate-400 bg-slate-400/10"}`}>{t.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">{t.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Milestones tab */}
        {tab === 2 && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Milestones</h3>
            </div>

            {milestones.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Flag size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <div className="text-sm text-muted-foreground">No milestones defined for this charter.</div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-3">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-4 pl-8 relative">
                      <div className={`absolute left-1.5 top-2 w-3 h-3 rounded-full border-2 border-card ${milestoneDot[m.status]}`} />
                      <div className="flex-1 flex items-center justify-between gap-4 bg-card border border-border rounded-lg px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">#{m.no}</span>
                            <span className="text-sm text-foreground font-medium">{m.description}</span>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">Due: {m.dueDate}</div>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex-shrink-0 ${milestoneColor[m.status]}`}>{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
