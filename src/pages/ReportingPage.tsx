import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, PieChart, Pie, Legend,
  CartesianGrid,
} from "recharts";
import { Download, Printer, TrendingUp, AlertTriangle, Users, CheckCircle2, Flag } from "lucide-react";
import {
  charterStatusData, charterProgressData,
  taskCompletionData, resourceWorkloadData,
  atRiskData, milestoneData,
} from "../features/reporting/reportData";
import { exportCSV, printReport } from "../utils/export";

// ── Shared styles ─────────────────────────────────────────────────────────────
const cardCls = "bg-card border border-border rounded-lg";
const labelCls = "text-[10px] text-muted-foreground font-mono uppercase tracking-wider";

// ── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="text-muted-foreground mb-1 font-mono">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill }} className="font-medium">
          {p.name}: {p.value}{typeof p.value === "number" && p.name?.includes("%") ? "%" : ""}
        </p>
      ))}
    </div>
  );
}

// ── Load color helper ─────────────────────────────────────────────────────────
function loadColor(load: number) {
  if (load > 100) return "#f87171";
  if (load >= 90)  return "#fbbf24";
  return "#34d399";
}

const riskColor: Record<string, string> = {
  Overdue:  "text-red-400 bg-red-400/10",
  "At risk":"text-orange-400 bg-orange-400/10",
  "Due soon":"text-amber-400 bg-amber-400/10",
  Stalled:  "text-amber-400 bg-amber-400/10",
};
const milestoneColor: Record<string, string> = {
  Overdue:  "text-red-400 bg-red-400/10",
  "At risk":"text-orange-400 bg-orange-400/10",
  Upcoming: "text-blue-400 bg-blue-400/10",
  Complete: "text-emerald-400 bg-emerald-400/10",
};
const urgencyColor: Record<string, string> = {
  Critical:"text-red-400 bg-red-400/10",
  High:    "text-orange-400 bg-orange-400/10",
  Medium:  "text-amber-400 bg-amber-400/10",
  Low:     "text-slate-400 bg-slate-400/10",
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "charter",   label: "Charter Overview",    icon: TrendingUp   },
  { id: "tasks",     label: "Task Completion",      icon: CheckCircle2 },
  { id: "resources", label: "Resource Workload",    icon: Users        },
  { id: "risk",      label: "Overdue / At-Risk",    icon: AlertTriangle},
  { id: "milestones",label: "Milestone Tracking",   icon: Flag         },
];

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className={`${cardCls} overflow-hidden mb-5`}>
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Stat mini-card ────────────────────────────────────────────────────────────
function Stat({ label, value, sub, color = "text-foreground" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className={`${cardCls} px-4 py-3`}>
      <div className={`text-2xl font-semibold font-mono ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5 font-mono opacity-70">{sub}</div>}
    </div>
  );
}

// ═══════════════════════════ REPORT TABS ═════════════════════════════════════

// ── 1. Charter Overview ───────────────────────────────────────────────────────
function CharterOverviewReport() {
  function handleExport() {
    exportCSV("charter-status", ["Charter ID","Title","Status","Priority","Progress %","Tasks Complete","Total Tasks","Owner","Target Date"],
      charterProgressData.map(c => [c.id, c.fullTitle, c.status, "", c.progress, c.completed, c.total, c.owner, c.targetDate])
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Stat label="Total charters"  value={charterProgressData.length} />
        <Stat label="Active"          value={charterProgressData.filter(c=>c.status==="Active").length}    color="text-emerald-400" />
        <Stat label="On Hold"         value={charterProgressData.filter(c=>c.status==="On Hold").length}   color="text-amber-400"   />
        <Stat label="Avg. progress"   value={`${Math.round(charterProgressData.reduce((a,c)=>a+c.progress,0)/charterProgressData.length)}%`} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <Section title="Status distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={charterStatusData} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {charterStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Progress by charter" sub="% of tasks completed">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charterProgressData} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0,100]} tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} width={120} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="progress" name="Progress %" radius={[0,4,4,0]}>
                {charterProgressData.map((e, i) => <Cell key={i} fill={e.progress===100?"#60a5fa":e.progress>=60?"#34d399":e.progress>=30?"#fbbf24":"#f87171"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      <Section title="Charter summary table" sub="All charters with current status and completion">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {["Charter ID","Title","Status","Progress","Tasks","Owner","Target Date"].map(h=>(
              <th key={h} className={`text-left py-2.5 px-3 ${labelCls}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {charterProgressData.map((c,i)=>(
              <tr key={c.id} className={`hover:bg-white/[0.02] ${i<charterProgressData.length-1?"border-b border-border":""}`}>
                <td className="py-2.5 px-3 text-xs font-mono text-primary/80">{c.id}</td>
                <td className="py-2.5 px-3 text-sm text-foreground max-w-[200px] truncate">{c.fullTitle}</td>
                <td className="py-2.5 px-3"><span className="text-xs font-mono text-muted-foreground">{c.status}</span></td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{width:`${c.progress}%`}} />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{c.progress}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-xs font-mono text-muted-foreground">{c.completed}/{c.total}</td>
                <td className="py-2.5 px-3 text-sm text-muted-foreground">{c.owner}</td>
                <td className="py-2.5 px-3 text-xs font-mono text-muted-foreground">{c.targetDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </Section>
    </div>
  );
}

// ── 2. Task Completion ────────────────────────────────────────────────────────
function TaskCompletionReport() {
  const totalTasks     = taskCompletionData.reduce((a,c)=>a+c.total,0);
  const totalCompleted = taskCompletionData.reduce((a,c)=>a+c.completed,0);
  const overallRate    = Math.round((totalCompleted/totalTasks)*100);

  function handleExport() {
    exportCSV("task-completion",["Charter","Total Tasks","Completed","Open","Completion Rate %"],
      taskCompletionData.map(c=>[c.name,c.total,c.completed,c.open,c.rate])
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Stat label="Total tasks"      value={totalTasks}                                        />
        <Stat label="Completed"        value={totalCompleted}    color="text-emerald-400"         />
        <Stat label="Open"             value={totalTasks-totalCompleted} color="text-amber-400"  />
        <Stat label="Overall rate"     value={`${overallRate}%`} color="text-primary"            />
      </div>

      <Section title="Tasks: total vs completed per charter">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={taskCompletionData} margin={{ left: 0, right: 16, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" />
            <YAxis tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
            <Bar dataKey="total"     name="Total tasks" fill="rgba(147,197,253,0.15)" radius={[4,4,0,0]} />
            <Bar dataKey="completed" name="Completed"   fill="#34d399"               radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section title="Completion rate per charter">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={taskCompletionData} layout="vertical" margin={{ left: 8, right: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" domain={[0,100]} tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="rate" name="Completion %" radius={[0,4,4,0]}>
              {taskCompletionData.map((e,i)=><Cell key={i} fill={e.rate>=75?"#34d399":e.rate>=40?"#fbbf24":"#f87171"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-end mt-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </Section>
    </div>
  );
}

// ── 3. Resource Workload ──────────────────────────────────────────────────────
function ResourceWorkloadReport() {
  const overloaded   = resourceWorkloadData.filter(p=>p.load>100).length;
  const nearCapacity = resourceWorkloadData.filter(p=>p.load>=90&&p.load<=100).length;
  const avgLoad      = Math.round(resourceWorkloadData.reduce((a,p)=>a+p.load,0)/resourceWorkloadData.length);

  function handleExport() {
    exportCSV("resource-workload",["Name","Role","Assigned Items","Total Load %","Status"],
      resourceWorkloadData.map(p=>[p.name,p.role,p.items,Math.round(p.load),p.load>100?"Overloaded":p.load>=90?"Near capacity":"Active"])
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Stat label="People assigned"  value={resourceWorkloadData.length}   />
        <Stat label="Overloaded"       value={overloaded}  color="text-red-400"    />
        <Stat label="Near capacity"    value={nearCapacity} color="text-amber-400" />
        <Stat label="Avg. load"        value={`${avgLoad}%`} />
      </div>

      <Section title="Resource load by person" sub="Primary assignments count full, secondary count half">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={resourceWorkloadData} layout="vertical" margin={{ left: 8, right: 56 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" domain={[0,150]} tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fill: "#6b8caf", fontSize: 10 }} tickLine={false} axisLine={false} width={90} />
            <Tooltip content={<ChartTooltip />} />
            {/* 100% reference line via data */}
            <Bar dataKey="load" name="Load %" radius={[0,4,4,0]}>
              {resourceWorkloadData.map((e,i)=><Cell key={i} fill={loadColor(e.load)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section title="Workload detail table">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {["Person","Role","Items","Total load","Status"].map(h=>(
              <th key={h} className={`text-left py-2.5 px-3 ${labelCls}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {resourceWorkloadData.map((p,i)=>{
              const load = Math.round(p.load);
              const status = load>100 ? {label:"Overloaded",cls:"text-red-400 bg-red-400/10"} : load>=90 ? {label:"Near capacity",cls:"text-amber-400 bg-amber-400/10"} : {label:"Active",cls:"text-emerald-400 bg-emerald-400/10"};
              return (
                <tr key={p.name} className={`hover:bg-white/[0.02] ${i<resourceWorkloadData.length-1?"border-b border-border":""}`}>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-semibold text-primary font-mono">{p.initials}</div>
                      <span className="text-sm text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">{p.role}</td>
                  <td className="py-2.5 px-3 text-sm font-mono text-foreground">{p.items}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${Math.min(load,130)/1.3}%`,background:loadColor(load)}} />
                      </div>
                      <span className="text-xs font-mono" style={{color:loadColor(load)}}>{load}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${status.cls}`}>{status.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end mt-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </Section>
    </div>
  );
}

// ── 4. Overdue / At-Risk ──────────────────────────────────────────────────────
function OverdueRiskReport() {
  const overdue  = atRiskData.filter(i=>i.risk==="Overdue").length;
  const stalled  = atRiskData.filter(i=>i.risk==="Stalled").length;
  const atRisk   = atRiskData.filter(i=>i.risk==="At risk").length;
  const critical = atRiskData.filter(i=>i.urgency==="Critical").length;

  function handleExport() {
    exportCSV("overdue-at-risk",["Type","ID","Summary","Charter","Urgency","Status","Due Date","Resource","Risk Level"],
      atRiskData.map(i=>[i.type,i.id,i.summary,i.charter,i.urgency,i.status,i.dueDate,i.resource,i.risk])
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Stat label="Overdue items"  value={overdue}   color="text-red-400"    />
        <Stat label="At risk"        value={atRisk}    color="text-orange-400" />
        <Stat label="Stalled"        value={stalled}   color="text-amber-400"  />
        <Stat label="Critical items" value={critical}  color="text-red-400"    />
      </div>

      <Section title="Overdue and at-risk items" sub="Requires immediate attention">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {["Type","ID","Summary","Charter","Resource","Urgency","Status","Due Date","Risk"].map(h=>(
              <th key={h} className={`text-left py-2.5 px-3 ${labelCls}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {atRiskData.map((item,i)=>(
              <tr key={item.id} className={`hover:bg-white/[0.02] ${i<atRiskData.length-1?"border-b border-border":""}`}>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${item.type==="Task"?"bg-primary/10 text-primary":"bg-violet-400/10 text-violet-400"}`}>{item.type}</span>
                </td>
                <td className="py-3 px-3 text-xs font-mono text-muted-foreground">{item.id}</td>
                <td className="py-3 px-3 text-sm text-foreground max-w-[180px] truncate">{item.summary}</td>
                <td className="py-3 px-3 text-xs font-mono text-muted-foreground">{item.charter}</td>
                <td className="py-3 px-3 text-sm text-muted-foreground">{item.resource}</td>
                <td className="py-3 px-3"><span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${urgencyColor[item.urgency]}`}>{item.urgency}</span></td>
                <td className="py-3 px-3 text-xs text-muted-foreground">{item.status}</td>
                <td className="py-3 px-3 text-xs font-mono text-muted-foreground">{item.dueDate}</td>
                <td className="py-3 px-3"><span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded ${riskColor[item.risk]}`}>{item.risk}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </Section>
    </div>
  );
}

// ── 5. Milestone Tracking ─────────────────────────────────────────────────────
function MilestoneReport() {
  const overdue   = milestoneData.filter(m=>m.status==="Overdue").length;
  const atRisk    = milestoneData.filter(m=>m.status==="At risk").length;
  const upcoming  = milestoneData.filter(m=>m.status==="Upcoming").length;
  const charters  = [...new Set(milestoneData.map(m=>m.charter))];

  function handleExport() {
    exportCSV("milestones",["Charter","Charter Title","Milestone No.","Description","Due Date","Status"],
      milestoneData.map(m=>[m.charter,m.charterTitle,m.no,m.description,m.dueDate,m.status])
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Stat label="Total milestones" value={milestoneData.length} />
        <Stat label="Overdue"          value={overdue}  color="text-red-400"    />
        <Stat label="At risk"          value={atRisk}   color="text-orange-400" />
        <Stat label="Upcoming"         value={upcoming} color="text-blue-400"   />
      </div>

      {charters.map(charterId => {
        const items = milestoneData.filter(m => m.charter === charterId);
        const title = items[0].charterTitle;
        return (
          <Section key={charterId} title={`${charterId} — ${title}`} sub={`${items.length} milestones`}>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {items.map((m, i) => {
                  const mc = milestoneColor[m.status];
                  const dotColor = m.status==="Overdue"?"bg-red-400":m.status==="At risk"?"bg-orange-400":m.status==="Complete"?"bg-emerald-400":"bg-blue-400";
                  return (
                    <div key={i} className="flex items-start gap-4 pl-8 relative">
                      <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-card ${dotColor}`} />
                      <div className="flex-1 flex items-start justify-between gap-4 bg-muted/30 border border-border rounded-lg px-4 py-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] text-muted-foreground font-mono">#{m.no}</span>
                            <span className="text-sm text-foreground font-medium">{m.description}</span>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">Due: {m.dueDate}</div>
                        </div>
                        <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded flex-shrink-0 ${mc}`}>{m.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        );
      })}

      <div className="flex justify-end">
        <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Download size={12} /> Export CSV
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════ MAIN PAGE ═══════════════════════════════════════

export function ReportingPage() {
  const [activeTab, setActiveTab] = useState("charter");
  const activeReport = TABS.find(t => t.id === activeTab);

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Reporting
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Project performance, resource allocation and milestone tracking
          </p>
        </div>
        <button
          onClick={() => printReport(activeReport?.label ?? "Report")}
          className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Printer size={13} /> Print report
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border flex-shrink-0 px-6 overflow-x-auto" style={{ background: "var(--card)" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === id
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Report content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "charter"    && <CharterOverviewReport />}
        {activeTab === "tasks"      && <TaskCompletionReport />}
        {activeTab === "resources"  && <ResourceWorkloadReport />}
        {activeTab === "risk"       && <OverdueRiskReport />}
        {activeTab === "milestones" && <MilestoneReport />}
      </div>
    </div>
  );
}
