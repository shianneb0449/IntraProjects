import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft, ChevronRight, Edit2, Archive,
  Users, Flag, Building2, CalendarDays,
  CheckCircle2, Circle, PauseCircle, AlertTriangle,
  ClipboardList, MoreHorizontal,
} from "lucide-react";
import { useData, type CharterDetail } from "../contexts/DataContext";

const statusCfg: Record<string, { color: string; bg: string; Icon: React.ElementType }> = {
  Active:     { color: "text-emerald-400", bg: "bg-emerald-400/10", Icon: CheckCircle2 },
  OnHold:     { color: "text-amber-400",   bg: "bg-amber-400/10",   Icon: PauseCircle  },
  Planning:   { color: "text-slate-400",   bg: "bg-slate-400/10",   Icon: Circle       },
  Draft:      { color: "text-slate-400",   bg: "bg-slate-400/10",   Icon: Circle       },
  Completed:  { color: "text-blue-400",    bg: "bg-blue-400/10",    Icon: CheckCircle2 },
  Cancelled:  { color: "text-red-400",     bg: "bg-red-400/10",     Icon: AlertTriangle},
};

const priColor: Record<string, string> = {
  Critical: "text-red-400", High: "text-orange-400", Medium: "text-amber-400", Low: "text-slate-400",
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
  const { getCharterDetail, getCharterMilestones } = useData();
  const [tab, setTab] = useState(0);
  const [charter, setCharter] = useState<CharterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!charterId) return;
    setLoading(true);
    getCharterDetail(Number(charterId))
      .then(setCharter)
      .catch(() => setError("Charter not found."))
      .finally(() => setLoading(false));
  }, [charterId]);

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading charter…</div>;
  }

  if (error || !charter) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-4 opacity-20">?</div>
        <div className="text-sm text-muted-foreground">{error ?? "Charter not found."}</div>
        <button onClick={() => navigate("/charters")} className="mt-4 text-xs text-primary hover:opacity-75">← Back to charters</button>
      </div>
    );
  }

  const milestones = getCharterMilestones(charter.charterNumber);
  const sc = statusCfg[charter.statusCode] ?? statusCfg.Draft;
  const StatusIcon = sc.Icon;
  const progress = charter.taskCount > 0 ? Math.round((charter.completedTaskCount / charter.taskCount) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <button onClick={() => navigate("/charters")} className="hover:text-foreground transition-colors">Project Charters</button>
          <ChevronRight size={12} />
          <span className="text-foreground font-mono">{charter.charterNumber}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <button onClick={() => navigate("/charters")} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mt-0.5 flex-shrink-0">
              <ChevronLeft size={16} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">{charter.charterNumber}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium font-mono ${sc.color} ${sc.bg}`}>
                  <StatusIcon size={11} />{charter.status}
                </span>
                <span className={`text-xs font-medium font-mono ${priColor[charter.priorityCode] ?? "text-slate-400"}`}>
                  ● {charter.priority}
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-foreground mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {charter.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users size={12} /><span>{charter.ownerDisplayName}</span></div>
                {charter.department && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Building2 size={12} /><span>{charter.department}</span></div>}
                {charter.targetDate && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays size={12} /><span>Target: {charter.targetDate}</span></div>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={12} /> Edit</button>
            <button className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"><Archive size={12} /> Archive</button>
            <button className="p-2 bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={14} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pl-9">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-sm">
            <div className={`h-full rounded-full ${pcol(progress)}`} style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{progress}% complete</span>
          <span className="text-xs text-muted-foreground font-mono">{charter.completedTaskCount}/{charter.taskCount} tasks</span>
        </div>
      </div>

      <div className="flex border-b border-border flex-shrink-0 px-6" style={{ background: "var(--card)" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${tab === i ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t}
            {t === "Tasks" && charter.tasks.length > 0 && <span className="ml-2 text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{charter.tasks.length}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 0 && (
          <div className="max-w-3xl">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Tasks",      value: `${charter.completedTaskCount}/${charter.taskCount}`, sub: "completed" },
                { label: "Progress",   value: `${progress}%`, sub: "overall" },
                { label: "Milestones", value: String(milestones.length), sub: "total" },
                { label: "Target",     value: charter.targetDate ?? "—", sub: "date" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
                  <div className="text-xl font-semibold text-foreground font-mono">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  <div className="text-[10px] text-muted-foreground opacity-70 font-mono">{sub}</div>
                </div>
              ))}
            </div>

            {(charter.problemStatement || charter.goalStatement) && (
              <div className="bg-card border border-border rounded-lg p-5 mb-5">
                <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Charter Statement</h3>
                {charter.problemStatement && (
                  <div className="mb-4">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mb-1">Problem statement</div>
                    <p className="text-sm text-foreground">{charter.problemStatement}</p>
                  </div>
                )}
                {charter.goalStatement && (
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mb-1">Goal statement</div>
                    <p className="text-sm text-foreground">{charter.goalStatement}</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Charter Details</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "Charter ID",   value: charter.charterNumber },
                  { label: "Owner",        value: charter.ownerDisplayName },
                  { label: "Department",   value: charter.department ?? "—" },
                  { label: "Priority",     value: charter.priority },
                  { label: "Status",       value: charter.status },
                  { label: "Approach",     value: charter.projectApproach ?? "—" },
                  { label: "Start date",   value: charter.startDate ?? "—" },
                  { label: "Target close", value: charter.targetDate ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">{label}</div>
                    <div className="text-sm text-foreground mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Tasks for {charter.charterNumber}</h3>
              <button onClick={() => navigate("/tasks")} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">+ New Task</button>
            </div>
            {charter.tasks.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <ClipboardList size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                <div className="text-sm text-muted-foreground">No tasks linked to this charter yet.</div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Task ID", "Summary", "Requestor", "Status", "Due Date"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground font-mono">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {charter.tasks.map((t, i) => (
                      <tr key={t.taskId} className={`hover:bg-white/[0.02] transition-colors ${i < charter.tasks.length - 1 ? "border-b border-border" : ""}`}>
                        <td className="px-4 py-3 text-xs font-mono text-primary/80">{t.taskNumber}</td>
                        <td className="px-4 py-3 text-sm text-foreground max-w-[220px] truncate">{t.title}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{t.requestor ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${taskStatusColor[t.status] ?? "text-slate-400 bg-slate-400/10"}`}>{t.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.dueDate ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div className="max-w-2xl">
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
