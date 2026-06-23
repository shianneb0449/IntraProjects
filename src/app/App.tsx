import { useState, Fragment } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  ListTodo,
  Users,
  BarChart3,
  ClipboardList,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  PauseCircle,
  XCircle,
  Activity,
  Shield,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = "Active" | "On Hold" | "Completed" | "Cancelled" | "Planning";
type Priority = "Critical" | "High" | "Medium" | "Low";

interface Charter {
  id: string;
  title: string;
  owner: string;
  status: Status;
  priority: Priority;
  progress: number;
  taskCount: number;
  completedTasks: number;
  startDate: string;
  targetDate: string;
  department: string;
}

interface AuditEntry {
  id: string;
  user: string;
  initials: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  changeType: "created" | "updated" | "status" | "assigned";
}

// ─── Data ────────────────────────────────────────────────────────────────────

const charters: Charter[] = [
  {
    id: "CHR-0041",
    title: "ERP System Migration — Phase 3",
    owner: "S. Burnett",
    status: "Active",
    priority: "Critical",
    progress: 67,
    taskCount: 24,
    completedTasks: 16,
    startDate: "2026-01-15",
    targetDate: "2026-07-31",
    department: "IT Infrastructure",
  },
  {
    id: "CHR-0039",
    title: "Vendor Onboarding Automation",
    owner: "M. Delacroix",
    status: "Active",
    priority: "High",
    progress: 42,
    taskCount: 18,
    completedTasks: 7,
    startDate: "2026-02-01",
    targetDate: "2026-09-15",
    department: "Procurement",
  },
  {
    id: "CHR-0037",
    title: "HR Policy Framework Refresh",
    owner: "T. Okafor",
    status: "Planning",
    priority: "Medium",
    progress: 12,
    taskCount: 31,
    completedTasks: 4,
    startDate: "2026-03-10",
    targetDate: "2026-12-01",
    department: "Human Resources",
  },
  {
    id: "CHR-0035",
    title: "Data Center Consolidation",
    owner: "A. Patel",
    status: "On Hold",
    priority: "High",
    progress: 55,
    taskCount: 14,
    completedTasks: 8,
    startDate: "2025-11-01",
    targetDate: "2026-06-30",
    department: "IT Infrastructure",
  },
  {
    id: "CHR-0033",
    title: "ISO 27001 Certification Program",
    owner: "R. Huang",
    status: "Active",
    priority: "Critical",
    progress: 88,
    taskCount: 42,
    completedTasks: 37,
    startDate: "2025-09-01",
    targetDate: "2026-06-30",
    department: "Compliance",
  },
  {
    id: "CHR-0029",
    title: "Customer Portal Redesign",
    owner: "L. Fontaine",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    taskCount: 22,
    completedTasks: 22,
    startDate: "2025-07-01",
    targetDate: "2026-01-31",
    department: "Digital",
  },
];

const auditLog: AuditEntry[] = [
  {
    id: "AUD-2094",
    user: "S. Burnett",
    initials: "SB",
    action: "Updated status",
    entity: "Task",
    entityId: "TSK-0188",
    timestamp: "2026-06-21 14:32",
    changeType: "status",
  },
  {
    id: "AUD-2093",
    user: "R. Huang",
    initials: "RH",
    action: "Assigned to",
    entity: "Subtask",
    entityId: "SUB-0441",
    timestamp: "2026-06-21 13:15",
    changeType: "assigned",
  },
  {
    id: "AUD-2092",
    user: "M. Delacroix",
    initials: "MD",
    action: "Created charter",
    entity: "Charter",
    entityId: "CHR-0042",
    timestamp: "2026-06-21 11:04",
    changeType: "created",
  },
  {
    id: "AUD-2091",
    user: "T. Okafor",
    initials: "TO",
    action: "Modified field",
    entity: "Task",
    entityId: "TSK-0172",
    timestamp: "2026-06-21 10:47",
    changeType: "updated",
  },
  {
    id: "AUD-2090",
    user: "A. Patel",
    initials: "AP",
    action: "Status changed",
    entity: "Charter",
    entityId: "CHR-0035",
    timestamp: "2026-06-20 17:22",
    changeType: "status",
  },
  {
    id: "AUD-2089",
    user: "L. Fontaine",
    initials: "LF",
    action: "Completed task",
    entity: "Task",
    entityId: "TSK-0165",
    timestamp: "2026-06-20 16:05",
    changeType: "status",
  },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FolderKanban, label: "Project Charters", id: "charters" },
  { icon: CheckSquare, label: "Project Tasks", id: "tasks" },
  { icon: ListTodo, label: "Subtasks", id: "subtasks" },
  { icon: Users, label: "Assignments", id: "assignments" },
  { icon: BarChart3, label: "Reporting", id: "reporting" },
  { icon: ClipboardList, label: "Audit Log", id: "audit" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<Status, { icon: React.ElementType; color: string; bg: string }> = {
  Active: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  "On Hold": { icon: PauseCircle, color: "text-amber-400", bg: "bg-amber-400/10" },
  Completed: { icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-400/10" },
  Cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  Planning: { icon: Circle, color: "text-slate-400", bg: "bg-slate-400/10" },
};

const priorityConfig: Record<Priority, { color: string; dot: string }> = {
  Critical: { color: "text-red-400", dot: "bg-red-400" },
  High: { color: "text-orange-400", dot: "bg-orange-400" },
  Medium: { color: "text-yellow-400", dot: "bg-yellow-400" },
  Low: { color: "text-slate-400", dot: "bg-slate-400" },
};

const auditTypeConfig: Record<AuditEntry["changeType"], { color: string; label: string }> = {
  created: { color: "text-emerald-400", label: "Created" },
  updated: { color: "text-blue-400", label: "Updated" },
  status: { color: "text-amber-400", label: "Status" },
  assigned: { color: "text-violet-400", label: "Assigned" },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${cfg.color} ${cfg.bg}`} style={{ fontFamily: "'Geist Mono', monospace" }}>
      <Icon size={11} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color}`} style={{ fontFamily: "'Geist Mono', monospace" }}>
      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
      {priority}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100 ? "bg-blue-400" : value >= 60 ? "bg-emerald-400" : value >= 30 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right" style={{ fontFamily: "'Geist Mono', monospace" }}>
        {value}%
      </span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 flex flex-col gap-4 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-md ${accent}`}>
          <Icon size={16} className="text-current" />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"}`}>
            {trend === "up" ? <TrendingUp size={11} /> : trend === "down" ? <TrendingDown size={11} /> : null}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
        <div className="text-xs text-muted-foreground mt-1 opacity-70" style={{ fontFamily: "'Geist Mono', monospace" }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [charterExpanded, setCharterExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");

  const filtered = filterStatus === "All" ? charters : charters.filter((c) => c.status === filterStatus);

  const activeCount = charters.filter((c) => c.status === "Active").length;
  const totalTasks = charters.reduce((a, c) => a + c.taskCount, 0);
  const completedTasks = charters.reduce((a, c) => a + c.completedTasks, 0);
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside
        className="flex flex-col w-56 border-r border-border flex-shrink-0"
        style={{ background: "var(--sidebar)" }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-border">
          <span
            className="text-lg font-bold text-foreground tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            u<span className="text-primary">Projects</span>
          </span>
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium"
            style={{ fontFamily: "'Geist Mono', monospace" }}
          >
            v1.0
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                activeNav === id
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary" style={{ fontFamily: "'Geist Mono', monospace" }}>
              SB
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate">S. Burnett</div>
              <div className="text-[10px] text-muted-foreground truncate">Project Owner</div>
            </div>
            <Shield size={13} className="text-muted-foreground ml-auto flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 flex items-center px-6 border-b border-border gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>IntraProjects</span>
            <ChevronRight size={13} />
            <span className="text-foreground font-medium">Dashboard</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded px-3 py-1.5 text-sm text-muted-foreground border border-border focus-within:border-primary/50 transition-colors">
              <Search size={13} />
              <input
                className="bg-transparent outline-none text-sm w-48 placeholder:text-muted-foreground"
                placeholder="Search charters, tasks…"
              />
            </div>
            <button className="relative p-2 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Overview
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Active tracking across all project charters · June 21, 2026
              </p>
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={14} />
              New Charter
            </button>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
            <StatCard
              icon={FolderKanban}
              label="Active Charters"
              value={activeCount}
              sub={`${charters.length} total`}
              trend="up"
              accent="text-blue-400 bg-blue-400/10"
            />
            <StatCard
              icon={CheckSquare}
              label="Tasks Complete"
              value={completedTasks}
              sub={`of ${totalTasks} total`}
              trend="up"
              accent="text-emerald-400 bg-emerald-400/10"
            />
            <StatCard
              icon={Activity}
              label="Overall Progress"
              value={`${overallProgress}%`}
              sub="across active work"
              trend="neutral"
              accent="text-violet-400 bg-violet-400/10"
            />
            <StatCard
              icon={AlertCircle}
              label="On Hold"
              value={charters.filter((c) => c.status === "On Hold").length}
              sub="require attention"
              trend="down"
              accent="text-amber-400 bg-amber-400/10"
            />
          </div>

          {/* Lower grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Charter table — spans 2 cols */}
            <div className="lg:col-span-2 bg-card rounded-lg border border-border overflow-hidden">
              {/* Table header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Project Charters
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-muted rounded overflow-hidden border border-border">
                    {(["All", "Active", "Planning", "On Hold", "Completed"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-2.5 py-1 text-xs transition-colors ${
                          filterStatus === s
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                    <Filter size={13} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["ID", "Charter Title", "Owner", "Priority", "Status", "Progress", "Tasks", "Target"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground whitespace-nowrap"
                          style={{ fontFamily: "'Geist Mono', monospace" }}
                        >
                          {h}
                        </th>
                      ))}
                      <th className="px-4 py-2.5 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((charter, i) => (
                      <Fragment key={charter.id}>
                        <tr
                          key={charter.id}
                          className={`border-b border-border hover:bg-white/[0.03] cursor-pointer transition-colors ${
                            charterExpanded === charter.id ? "bg-white/[0.03]" : ""
                          } ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                          onClick={() =>
                            setCharterExpanded(charterExpanded === charter.id ? null : charter.id)
                          }
                        >
                          <td
                            className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap"
                            style={{ fontFamily: "'Geist Mono', monospace" }}
                          >
                            {charter.id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <ChevronRight
                                size={12}
                                className={`text-muted-foreground transition-transform ${charterExpanded === charter.id ? "rotate-90" : ""}`}
                              />
                              <span className="font-medium text-foreground text-sm">{charter.title}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 ml-5">{charter.department}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                            {charter.owner}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <PriorityBadge priority={charter.priority} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <StatusBadge status={charter.status} />
                          </td>
                          <td className="px-4 py-3 min-w-[120px]">
                            <ProgressBar value={charter.progress} />
                          </td>
                          <td
                            className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap"
                            style={{ fontFamily: "'Geist Mono', monospace" }}
                          >
                            {charter.completedTasks}/{charter.taskCount}
                          </td>
                          <td
                            className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap"
                            style={{ fontFamily: "'Geist Mono', monospace" }}
                          >
                            {charter.targetDate}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="p-1 rounded hover:bg-white/10 text-muted-foreground transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal size={13} />
                            </button>
                          </td>
                        </tr>

                        {/* Expanded task preview */}
                        {charterExpanded === charter.id && (
                          <tr key={`${charter.id}-detail`} className="border-b border-border bg-white/[0.02]">
                            <td colSpan={9} className="px-4 py-3 pl-12">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <span style={{ fontFamily: "'Geist Mono', monospace" }}>Charter detail</span>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { label: "Initiated", value: charter.startDate },
                                  { label: "Target Close", value: charter.targetDate },
                                  { label: "Department", value: charter.department },
                                  { label: "Owner", value: charter.owner },
                                  { label: "Open Tasks", value: charter.taskCount - charter.completedTasks },
                                  { label: "Charter ID", value: charter.id },
                                ].map(({ label, value }) => (
                                  <div key={label}>
                                    <div
                                      className="text-[10px] text-muted-foreground uppercase tracking-wider"
                                      style={{ fontFamily: "'Geist Mono', monospace" }}
                                    >
                                      {label}
                                    </div>
                                    <div className="text-sm text-foreground mt-0.5">{value}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button className="px-3 py-1.5 bg-primary/15 text-primary text-xs rounded hover:bg-primary/25 transition-colors font-medium">
                                  Open Charter
                                </button>
                                <button className="px-3 py-1.5 bg-white/5 text-muted-foreground text-xs rounded hover:bg-white/10 transition-colors">
                                  View Tasks
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

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Status distribution */}
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Status Distribution
                </h3>
                <div className="space-y-3">
                  {(["Active", "Planning", "On Hold", "Completed", "Cancelled"] as Status[]).map((s) => {
                    const count = charters.filter((c) => c.status === s).length;
                    const pct = Math.round((count / charters.length) * 100);
                    const cfg = statusConfig[s];
                    return (
                      <div key={s}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${cfg.color}`}>{s}</span>
                          <span
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "'Geist Mono', monospace" }}
                          >
                            {count} · {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cfg.color.replace("text-", "bg-")}`}
                            style={{ width: `${pct}%`, opacity: 0.7 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Audit log */}
              <div className="bg-card rounded-lg border border-border flex-1 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Recent Audit Events
                  </h3>
                  <button className="text-xs text-primary hover:text-primary/80 transition-colors">View all</button>
                </div>
                <div className="overflow-y-auto max-h-72">
                  {auditLog.map((entry, i) => {
                    const typeCfg = auditTypeConfig[entry.changeType];
                    return (
                      <div
                        key={entry.id}
                        className={`flex gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors ${
                          i < auditLog.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        <div className="size-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-semibold text-foreground flex-shrink-0" style={{ fontFamily: "'Geist Mono', monospace" }}>
                          {entry.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-xs font-medium text-foreground">{entry.user}</span>
                            <span className="text-xs text-muted-foreground">{entry.action}</span>
                            <span
                              className="text-[10px] font-medium text-primary/80"
                              style={{ fontFamily: "'Geist Mono', monospace" }}
                            >
                              {entry.entityId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[10px] font-medium ${typeCfg.color}`}
                              style={{ fontFamily: "'Geist Mono', monospace" }}
                            >
                              {typeCfg.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
                              {entry.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3" style={{ fontFamily: "'Geist Mono', monospace" }}>
                  Quick Access
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Clock, label: "Overdue Tasks", count: 3 },
                    { icon: Users, label: "Assignments", count: 14 },
                    { icon: BarChart3, label: "Reports", count: null },
                    { icon: ClipboardList, label: "Audit Log", count: null },
                  ].map(({ icon: Icon, label, count }) => (
                    <button
                      key={label}
                      className="flex flex-col gap-1.5 p-3 rounded bg-muted hover:bg-white/10 border border-border hover:border-white/20 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <Icon size={13} className="text-muted-foreground" />
                        {count !== null && (
                          <span
                            className="text-[10px] font-medium text-primary bg-primary/15 rounded px-1.5 py-0.5"
                            style={{ fontFamily: "'Geist Mono', monospace" }}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-foreground">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
