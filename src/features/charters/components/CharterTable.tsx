import { Fragment, useState } from "react";
import {
  ChevronRight, MoreHorizontal, Filter,
  CheckCircle2, Circle, PauseCircle, XCircle,
} from "lucide-react";
import type { CharterStatus } from "../../../types/charter";
import type { Priority } from "../../../types/common";
import type { MockCharter } from "../data";

// ── Status badge ──────────────────────────────────────────────────────────────

const statusCfg: Record<CharterStatus, { icon: React.ElementType; color: string; bg: string }> = {
  Active:    { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  "On Hold": { icon: PauseCircle,  color: "text-amber-400",   bg: "bg-amber-400/10"   },
  Planning:  { icon: Circle,       color: "text-slate-400",   bg: "bg-slate-400/10"   },
  Completed: { icon: CheckCircle2, color: "text-blue-400",    bg: "bg-blue-400/10"    },
  Cancelled: { icon: XCircle,      color: "text-red-400",     bg: "bg-red-400/10"     },
};

function StatusBadge({ status }: { status: CharterStatus }) {
  const cfg = statusCfg[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium font-mono ${cfg.color} ${cfg.bg}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}

// ── Priority badge ────────────────────────────────────────────────────────────

const priCfg: Record<Priority, { color: string; dot: string }> = {
  Critical: { color: "text-red-400",    dot: "bg-red-400"    },
  High:     { color: "text-orange-400", dot: "bg-orange-400" },
  Medium:   { color: "text-yellow-400", dot: "bg-yellow-400" },
  Low:      { color: "text-slate-400",  dot: "bg-slate-400"  },
};

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priCfg[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium font-mono ${cfg.color}`}>
      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
      {priority}
    </span>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  const color = value === 100 ? "bg-blue-400" : value >= 60 ? "bg-emerald-400" : value >= 30 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground font-mono w-8 text-right">{value}%</span>
    </div>
  );
}

// ── Charter Table ─────────────────────────────────────────────────────────────

const STATUS_FILTERS: Array<CharterStatus | "All"> = ["All", "Active", "Planning", "On Hold", "Completed"];

interface Props {
  charters: MockCharter[];
  onNewCharter?: () => void;
  compact?: boolean; // true = dashboard mode (no search bar, fewer columns)
}

export function CharterTable({ charters, onNewCharter, compact = false }: Props) {
  const [filterStatus, setFilterStatus] = useState<CharterStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"targetDate" | "progress" | "priority" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filter
  let rows = charters.filter((c) => {
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchSearch = search === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Sort
  if (sortField) {
    const priOrder: Priority[] = ["Critical", "High", "Medium", "Low"];
    rows = [...rows].sort((a, b) => {
      let val = 0;
      if (sortField === "targetDate") val = a.targetDate.localeCompare(b.targetDate);
      if (sortField === "progress") val = a.progress - b.progress;
      if (sortField === "priority") val = priOrder.indexOf(a.priority) - priOrder.indexOf(b.priority);
      return sortDir === "asc" ? val : -val;
    });
  }

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  function SortIcon({ field }: { field: typeof sortField }) {
    if (sortField !== field) return <span className="text-muted-foreground/40 ml-1">↕</span>;
    return <span className="text-primary ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border gap-4">
        <h2 className="text-sm font-semibold text-foreground shrink-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Project Charters
          <span className="ml-2 text-xs font-normal text-muted-foreground font-mono">({rows.length})</span>
        </h2>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Search — hidden in compact mode */}
          {!compact && (
            <input
              className="bg-muted border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 w-44 transition-colors"
              placeholder="Search charters…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}

          {/* Status filter tabs */}
          <div className="flex items-center bg-muted rounded overflow-hidden border border-border">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 text-xs transition-colors ${
                  filterStatus === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={13} />
          </button>

          {onNewCharter && (
            <button
              onClick={onNewCharter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              + New Charter
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">Charter Title</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">Owner</th>
              <th
                className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap cursor-pointer hover:text-foreground select-none"
                onClick={() => toggleSort("priority")}
              >
                Priority<SortIcon field="priority" />
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">Status</th>
              <th
                className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap cursor-pointer hover:text-foreground select-none"
                onClick={() => toggleSort("progress")}
              >
                Progress<SortIcon field="progress" />
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">Tasks</th>
              <th
                className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap cursor-pointer hover:text-foreground select-none"
                onClick={() => toggleSort("targetDate")}
              >
                Target<SortIcon field="targetDate" />
              </th>
              <th className="px-4 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No charters match your filters.
                </td>
              </tr>
            )}
            {rows.map((charter, i) => (
              <Fragment key={charter.id}>
                <tr
                  className={`border-b border-border hover:bg-white/[0.03] cursor-pointer transition-colors ${
                    expanded === charter.id ? "bg-white/[0.03]" : ""
                  } ${i === rows.length - 1 && expanded !== charter.id ? "border-b-0" : ""}`}
                  onClick={() => setExpanded(expanded === charter.id ? null : charter.id)}
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{charter.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        size={12}
                        className={`text-muted-foreground transition-transform shrink-0 ${expanded === charter.id ? "rotate-90" : ""}`}
                      />
                      <div>
                        <div className="font-medium text-foreground text-sm">{charter.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{charter.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{charter.owner}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge priority={charter.priority} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={charter.status} /></td>
                  <td className="px-4 py-3"><ProgressBar value={charter.progress} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                    {charter.completedTasks}/{charter.taskCount}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{charter.targetDate}</td>
                  <td className="px-4 py-3">
                    <button
                      className="p-1 rounded hover:bg-white/10 text-muted-foreground transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreHorizontal size={13} />
                    </button>
                  </td>
                </tr>

                {/* ── Expanded detail row ── */}
                {expanded === charter.id && (
                  <tr className={`border-b border-border bg-white/[0.02] ${i === rows.length - 1 ? "border-b-0" : ""}`}>
                    <td colSpan={9} className="px-4 py-4 pl-12">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4 sm:grid-cols-4">
                        {[
                          { label: "Charter ID",   value: charter.id },
                          { label: "Department",   value: charter.department },
                          { label: "Owner",        value: charter.owner },
                          { label: "Start Date",   value: charter.startDate },
                          { label: "Target Close", value: charter.targetDate },
                          { label: "Open Tasks",   value: String(charter.taskCount - charter.completedTasks) },
                          { label: "Progress",     value: `${charter.progress}%` },
                          { label: "Priority",     value: charter.priority },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">{label}</div>
                            <div className="text-sm text-foreground mt-0.5">{value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-primary/15 text-primary text-xs rounded hover:bg-primary/25 transition-colors font-medium">
                          Open Charter
                        </button>
                        <button className="px-3 py-1.5 bg-white/5 text-muted-foreground text-xs rounded hover:bg-white/10 transition-colors">
                          View Tasks
                        </button>
                        <button className="px-3 py-1.5 bg-white/5 text-muted-foreground text-xs rounded hover:bg-white/10 transition-colors">
                          Change Status
                        </button>
                        <button className="px-3 py-1.5 bg-white/5 text-muted-foreground text-xs rounded hover:bg-white/10 transition-colors">
                          Audit History
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
