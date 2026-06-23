import { useState } from "react";
import { Users, AlertTriangle, CheckCircle2, BarChart3, ChevronDown, ChevronRight } from "lucide-react";
import { MOCK_ASSIGNMENTS, type Assignment } from "../features/assignments/data";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTotalLoad(assignments: Assignment[]) {
  // Primary assignments count full; secondary count half
  return assignments.reduce((sum, a) =>
    sum + (a.resourceRole === "Primary" ? a.load : a.load / 2), 0
  );
}

function getLoadColor(load: number) {
  if (load > 100) return { bar: "bg-red-400",    text: "text-red-400",    badge: "bg-red-400/10 text-red-400"    };
  if (load >= 90) return { bar: "bg-amber-400",   text: "text-amber-400",  badge: "bg-amber-400/10 text-amber-400" };
  if (load >= 50) return { bar: "bg-emerald-400", text: "text-emerald-400",badge: "bg-emerald-400/10 text-emerald-400" };
  return             { bar: "bg-slate-400",    text: "text-slate-400",  badge: "bg-slate-400/10 text-slate-400" };
}

function getLoadLabel(load: number) {
  if (load > 100) return "Overloaded";
  if (load >= 90) return "Near capacity";
  if (load >= 50) return "Active";
  return "Available";
}

const urgencyColor: Record<string, string> = {
  Critical: "text-red-400 bg-red-400/10",
  High:     "text-orange-400 bg-orange-400/10",
  Medium:   "text-amber-400 bg-amber-400/10",
  Low:      "text-slate-400 bg-slate-400/10",
};

const statusColor: Record<string, string> = {
  "Open":                "text-slate-400 bg-slate-400/10",
  "In Progress":         "text-emerald-400 bg-emerald-400/10",
  "Stalled":             "text-amber-400 bg-amber-400/10",
  "Waiting on response": "text-amber-400 bg-amber-400/10",
  "Under review":        "text-blue-400 bg-blue-400/10",
  "Complete":            "text-blue-400 bg-blue-400/10",
  "Cancelled":           "text-red-400 bg-red-400/10",
};

// ── Person card ───────────────────────────────────────────────────────────────

interface PersonCardProps {
  name: string;
  initials: string;
  role: string;
  assignments: Assignment[];
}

function PersonCard({ name, initials, role, assignments }: PersonCardProps) {
  const [expanded, setExpanded] = useState(false);
  const totalLoad = getTotalLoad(assignments);
  const lc = getLoadColor(totalLoad);
  const barWidth = Math.min(totalLoad, 130); // cap bar at 130% visually

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Person header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
      >
        {/* Avatar */}
        <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary font-mono flex-shrink-0">
          {initials}
        </div>

        {/* Name + role */}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-foreground text-sm">{name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{role}</div>
        </div>

        {/* Assignment count */}
        <div className="text-center flex-shrink-0">
          <div className="text-lg font-semibold text-foreground font-mono">{assignments.length}</div>
          <div className="text-[10px] text-muted-foreground font-mono">items</div>
        </div>

        {/* Load bar */}
        <div className="w-32 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[10px] font-medium font-mono ${lc.text}`}>{getLoadLabel(totalLoad)}</span>
            <span className={`text-[10px] font-mono ${lc.text}`}>{Math.round(totalLoad)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${lc.bar}`}
              style={{ width: `${(barWidth / 130) * 100}%` }}
            />
          </div>
        </div>

        {/* Load badge */}
        <span className={`text-[10px] font-medium font-mono px-2 py-1 rounded flex-shrink-0 ${lc.badge}`}>
          {Math.round(totalLoad)}%
        </span>

        {/* Chevron */}
        <div className="text-muted-foreground flex-shrink-0">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </div>
      </button>

      {/* Expanded assignments */}
      {expanded && (
        <div className="border-t border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">ID</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">Summary</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">Charter</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">Role</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">Load</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">Urgency</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">Status</th>
                <th className="text-left px-4 py-2.5 text-[10px] font-medium text-muted-foreground font-mono">Due</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr
                  key={a.id}
                  className={`hover:bg-white/[0.02] transition-colors ${i < assignments.length - 1 ? "border-b border-border" : ""}`}
                >
                  <td className="px-5 py-3">
                    <div className="text-xs font-mono text-primary/80">{a.entityNumber}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{a.entityType}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="text-sm text-foreground truncate">{a.entitySummary}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-mono text-muted-foreground">{a.charterNumber}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px] truncate">{a.charterTitle}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${
                      a.resourceRole === "Primary"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {a.resourceRole}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.load}%</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${urgencyColor[a.urgency]}`}>
                      {a.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${statusColor[a.status] ?? "text-slate-400 bg-slate-400/10"}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{a.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Per-person total */}
          <div className="flex items-center justify-end gap-3 px-5 py-2.5 border-t border-border bg-muted/20">
            <span className="text-[10px] text-muted-foreground font-mono">Combined load</span>
            <span className={`text-xs font-semibold font-mono ${lc.text}`}>{Math.round(totalLoad)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ViewMode = "resources" | "table";

export function AssignmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("resources");
  const [filterCharter, setFilterCharter] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Apply filters
  const filtered = MOCK_ASSIGNMENTS.filter(a => {
    const matchCharter = filterCharter === "All" || a.charterNumber === filterCharter;
    const matchStatus  = filterStatus  === "All" || a.status === filterStatus;
    return matchCharter && matchStatus;
  });

  // Group by person
  const people = [...new Set(filtered.map(a => a.personName))];
  const byPerson = people.map(name => ({
    name,
    initials:    filtered.find(a => a.personName === name)!.personInitials,
    role:        filtered.find(a => a.personName === name)!.personRole,
    assignments: filtered.filter(a => a.personName === name),
  })).sort((a, b) => getTotalLoad(b.assignments) - getTotalLoad(a.assignments));

  // Summary stats
  const totalPeople    = [...new Set(MOCK_ASSIGNMENTS.map(a => a.personName))].length;
  const overloaded     = byPerson.filter(p => getTotalLoad(p.assignments) > 100).length;
  const nearCapacity   = byPerson.filter(p => { const l = getTotalLoad(p.assignments); return l >= 90 && l <= 100; }).length;
  const totalItems     = MOCK_ASSIGNMENTS.length;

  const charterOptions = [...new Set(MOCK_ASSIGNMENTS.map(a => a.charterNumber))];
  const statusOptions  = [...new Set(MOCK_ASSIGNMENTS.map(a => a.status))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Assignments
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Resource allocation across all active tasks and subtasks
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-muted border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode("resources")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === "resources" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={13} /> Resources
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 size={13} /> All assignments
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary"><Users size={14} /></div>
          </div>
          <div className="text-2xl font-semibold text-foreground font-mono">{totalPeople}</div>
          <div className="text-xs text-muted-foreground mt-1">People assigned</div>
        </div>
        <div className="bg-card border border-border rounded-lg px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-md bg-red-400/10 text-red-400"><AlertTriangle size={14} /></div>
          </div>
          <div className="text-2xl font-semibold text-foreground font-mono">{overloaded}</div>
          <div className="text-xs text-muted-foreground mt-1">Overloaded (&gt;100%)</div>
        </div>
        <div className="bg-card border border-border rounded-lg px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-md bg-amber-400/10 text-amber-400"><AlertTriangle size={14} /></div>
          </div>
          <div className="text-2xl font-semibold text-foreground font-mono">{nearCapacity}</div>
          <div className="text-xs text-muted-foreground mt-1">Near capacity (90–100%)</div>
        </div>
        <div className="bg-card border border-border rounded-lg px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-md bg-emerald-400/10 text-emerald-400"><CheckCircle2 size={14} /></div>
          </div>
          <div className="text-2xl font-semibold text-foreground font-mono">{totalItems}</div>
          <div className="text-xs text-muted-foreground mt-1">Total assigned items</div>
        </div>
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
            {charterOptions.map(c => <option key={c} value={c}>{c}</option>)}
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
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{filtered.length} assignments</span>
      </div>

      {/* ── Resource cards view ── */}
      {viewMode === "resources" && (
        <div className="flex flex-col gap-3">
          {byPerson.map(p => (
            <PersonCard
              key={p.name}
              name={p.name}
              initials={p.initials}
              role={p.role}
              assignments={p.assignments}
            />
          ))}
        </div>
      )}

      {/* ── Flat table view ── */}
      {viewMode === "table" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Person", "ID", "Summary", "Charter", "Resource role", "Load", "Urgency", "Status", "Due"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">No assignments match your filters.</td></tr>
              )}
              {filtered.map((a, i) => (
                <tr key={a.id} className={`hover:bg-white/[0.02] transition-colors ${i < filtered.length - 1 ? "border-b border-border" : ""}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-primary/15 flex items-center justify-center text-[9px] font-semibold text-primary font-mono flex-shrink-0">
                        {a.personInitials}
                      </div>
                      <span className="text-sm text-foreground">{a.personName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-mono text-primary/80">{a.entityNumber}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{a.entityType}</div>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <div className="text-sm text-foreground truncate">{a.entitySummary}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-mono text-muted-foreground">{a.charterNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${
                      a.resourceRole === "Primary" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {a.resourceRole}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.load}%</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${urgencyColor[a.urgency]}`}>{a.urgency}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${statusColor[a.status] ?? "text-slate-400 bg-slate-400/10"}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{a.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
