import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, PieChart, Pie, Legend,
} from "recharts";
import {
  FolderKanban, CheckSquare, Activity, AlertCircle,
  TrendingUp, TrendingDown, Clock, Users,
} from "lucide-react";
import { useData } from "../contexts/DataContext";

const statusColors: Record<string, string> = {
  Active: "#34d399", Planning: "#94a3b8", Draft: "#94a3b8",
  "On Hold": "#fbbf24", Completed: "#60a5fa", Cancelled: "#f87171",
};
const auditTypeCfg = {
  created:  { color: "text-emerald-400", label: "Created"  },
  updated:  { color: "text-blue-400",    label: "Updated"  },
  status:   { color: "text-amber-400",   label: "Status"   },
  assigned: { color: "text-violet-400",  label: "Assigned" },
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="text-muted-foreground mb-1 font-mono">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill ?? p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

function pcol(v: number) {
  return v === 100 ? "bg-blue-400" : v >= 60 ? "bg-emerald-400" : v >= 30 ? "bg-amber-400" : "bg-red-400";
}

export function DashboardPage() {
  const { charters, audit } = useData();

  const activeCount    = charters.filter(c => c.status === "Active").length;
  const totalTasks     = charters.reduce((a, c) => a + c.taskCount, 0);
  const completedTasks = charters.reduce((a, c) => a + c.completedTasks, 0);
  const overallProg    = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const onHoldCount    = charters.filter(c => c.status === "On Hold").length;

  // Chart data
  const statusDist = Object.entries(
    charters.reduce((acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count, color: statusColors[status] ?? "#94a3b8" }));

  const progressData = charters.map(c => ({
    name: c.id,
    title: c.title.length > 26 ? c.title.slice(0, 24) + "…" : c.title,
    progress: c.progress,
  }));

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Active tracking across all project charters</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Charter
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          { icon: FolderKanban, label: "Active Charters",  value: activeCount,      sub: `${charters.length} total`,  accent: "text-blue-400 bg-blue-400/10",     trend: "up"   },
          { icon: CheckSquare,  label: "Tasks Complete",   value: completedTasks,   sub: `of ${totalTasks} total`,    accent: "text-emerald-400 bg-emerald-400/10", trend: "up"  },
          { icon: Activity,     label: "Overall Progress", value: `${overallProg}%`,sub: "across active work",        accent: "text-violet-400 bg-violet-400/10",  trend: null  },
          { icon: AlertCircle,  label: "On Hold",          value: onHoldCount,      sub: "require attention",         accent: "text-amber-400 bg-amber-400/10",    trend: "down"},
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

      {/* Charts + right column */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Charter progress chart */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Charter progress
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData} layout="vertical" margin={{ left: 8, right: 40 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} width={72} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="progress" name="Progress %" radius={[0, 4, 4, 0]}>
                  {progressData.map((e, i) => (
                    <Cell key={i} fill={e.progress === 100 ? "#60a5fa" : e.progress >= 60 ? "#34d399" : e.progress >= 30 ? "#fbbf24" : "#f87171"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Charter list compact */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Project Charters</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "Title", "Progress", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground font-mono">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {charters.map((c, i) => (
                  <tr key={c.id} className={`hover:bg-white/[0.02] transition-colors ${i < charters.length - 1 ? "border-b border-border" : ""}`}>
                    <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{c.id}</td>
                    <td className="px-4 py-2.5 text-sm text-foreground max-w-[200px] truncate">{c.title}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${pcol(c.progress)}`} style={{ width: `${c.progress}%` }} />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">{c.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-mono text-muted-foreground">{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Status donut */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Status distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusDist} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {statusDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Audit feed */}
          <div className="bg-card border border-border rounded-lg flex-1 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent activity</h3>
            </div>
            <div>
              {audit.map((a, i) => {
                const tc = auditTypeCfg[a.changeType];
                return (
                  <div key={a.id} className={`flex gap-3 px-4 py-3 hover:bg-white/[0.02] ${i < audit.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0 font-mono">{a.initials}</div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xs font-medium text-foreground">{a.user}</span>
                        <span className="text-xs text-muted-foreground">{a.action}</span>
                        <span className="text-[10px] text-primary/80 font-mono">{a.entityId}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono ${tc.color}`}>{tc.label}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{a.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-mono">Quick access</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Clock,  label: "At-risk items",  count: 3  },
                { icon: Users,  label: "Assignments",    count: 12 },
              ].map(({ icon: Icon, label, count }) => (
                <button key={label} className="flex flex-col gap-1.5 p-3 rounded bg-muted hover:bg-white/10 border border-border hover:border-white/20 transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <Icon size={13} className="text-muted-foreground" />
                    <span className="text-[10px] font-mono text-primary bg-primary/15 rounded px-1.5 py-0.5">{count}</span>
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
