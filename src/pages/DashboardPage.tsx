import {
  FolderKanban, CheckSquare, Activity, AlertCircle,
  Clock, Users, BarChart3, ClipboardList, TrendingUp, TrendingDown,
} from "lucide-react";
import { MOCK_CHARTERS, MOCK_AUDIT } from "../features/charters/data";
import { CharterTable } from "../features/charters/components/CharterTable";
import type { CharterStatus } from "../types/charter";

const statusCfg: Record<CharterStatus, { color: string }> = {
  Active:    { color: "text-emerald-400" },
  "On Hold": { color: "text-amber-400"   },
  Planning:  { color: "text-slate-400"   },
  Completed: { color: "text-blue-400"    },
  Cancelled: { color: "text-red-400"     },
};

const auditTypeCfg = {
  created:  { color: "text-emerald-400", label: "Created"  },
  updated:  { color: "text-blue-400",    label: "Updated"  },
  status:   { color: "text-amber-400",   label: "Status"   },
  assigned: { color: "text-violet-400",  label: "Assigned" },
};

export function DashboardPage() {
  const charters = MOCK_CHARTERS;
  const activeCount    = charters.filter(c => c.status === "Active").length;
  const totalTasks     = charters.reduce((a, c) => a + c.taskCount, 0);
  const completedTasks = charters.reduce((a, c) => a + c.completedTasks, 0);
  const overallProg    = Math.round((completedTasks / totalTasks) * 100);
  const onHoldCount    = charters.filter(c => c.status === "On Hold").length;

  return (
    <div className="p-6">
      {/* Page title */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Active tracking across all project charters · June 23, 2026
          </p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Charter
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          { icon: FolderKanban, label: "Active Charters", value: activeCount,      sub: `${charters.length} total`,     accent: "text-blue-400 bg-blue-400/10",    trend: "up" },
          { icon: CheckSquare,  label: "Tasks Complete",  value: completedTasks,   sub: `of ${totalTasks} total`,        accent: "text-emerald-400 bg-emerald-400/10", trend: "up" },
          { icon: Activity,     label: "Overall Progress",value: `${overallProg}%`,sub: "across active work",            accent: "text-violet-400 bg-violet-400/10", trend: null },
          { icon: AlertCircle,  label: "On Hold",         value: onHoldCount,      sub: "require attention",             accent: "text-amber-400 bg-amber-400/10",   trend: "down" },
        ].map(({ icon: Icon, label, value, sub, accent, trend }) => (
          <div key={label} className="bg-card rounded-lg border border-border p-5 hover:border-white/20 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-md ${accent}`}><Icon size={16} /></div>
              {trend === "up"   && <TrendingUp  size={13} className="text-emerald-400 mt-0.5" />}
              {trend === "down" && <TrendingDown size={13} className="text-red-400 mt-0.5" />}
            </div>
            <div className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
            <div className="text-xs text-muted-foreground mt-1 opacity-70 font-mono">{sub}</div>
          </div>
        ))}
      </div>

      {/* Lower grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Charter table — 2 cols */}
        <div className="lg:col-span-2">
          <CharterTable charters={charters} compact />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Status distribution */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Status Distribution
            </h3>
            <div className="space-y-3">
              {(["Active", "Planning", "On Hold", "Completed", "Cancelled"] as CharterStatus[]).map(s => {
                const count = charters.filter(c => c.status === s).length;
                const pct   = Math.round((count / charters.length) * 100);
                const cfg   = statusCfg[s];
                return (
                  <div key={s}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${cfg.color}`}>{s}</span>
                      <span className="text-xs text-muted-foreground font-mono">{count} · {pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.color.replace("text-", "bg-")}`} style={{ width: `${pct}%`, opacity: 0.7 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit feed */}
          <div className="bg-card rounded-lg border border-border flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent Audit Events</h3>
              <button className="text-xs text-primary hover:text-primary/80 transition-colors">View all</button>
            </div>
            <div className="overflow-y-auto">
              {MOCK_AUDIT.map((entry, i) => {
                const tc = auditTypeCfg[entry.changeType];
                return (
                  <div key={entry.id} className={`flex gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors ${i < MOCK_AUDIT.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="size-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0 font-mono">{entry.initials}</div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xs font-medium text-foreground">{entry.user}</span>
                        <span className="text-xs text-muted-foreground">{entry.action}</span>
                        <span className="text-[10px] font-medium text-primary/80 font-mono">{entry.entityId}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-medium font-mono ${tc.color}`}>{tc.label}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick access */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">Quick Access</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Clock,        label: "Overdue Tasks", count: 3    },
                { icon: Users,        label: "Assignments",   count: 14   },
                { icon: BarChart3,    label: "Reports",       count: null },
                { icon: ClipboardList,label: "Audit Log",     count: null },
              ].map(({ icon: Icon, label, count }) => (
                <button key={label} className="flex flex-col gap-1.5 p-3 rounded bg-muted hover:bg-white/10 border border-border hover:border-white/20 transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <Icon size={13} className="text-muted-foreground" />
                    {count !== null && (
                      <span className="text-[10px] font-medium text-primary bg-primary/15 rounded px-1.5 py-0.5 font-mono">{count}</span>
                    )}
                  </div>
                  <span className="text-xs text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
