import { MOCK_AUDIT } from "../features/charters/data";

const auditTypeCfg = {
  created:  { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Created"  },
  updated:  { color: "text-blue-400",    bg: "bg-blue-400/10",    label: "Updated"  },
  status:   { color: "text-amber-400",   bg: "bg-amber-400/10",   label: "Status"   },
  assigned: { color: "text-violet-400",  bg: "bg-violet-400/10",  label: "Assigned" },
};

// Expand the mock list so it looks like a real log
const allAudit = [...MOCK_AUDIT, ...MOCK_AUDIT.map((e, i) => ({
  ...e, id: `AUD-${2080 + i}`,
  timestamp: `2026-06-19 ${10 + i}:${String(i * 7).padStart(2, "0")}`,
}))];

export function AuditPage() {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Full change history across all entities and users</p>
        </div>
        <span className="text-xs text-muted-foreground font-mono bg-card border border-border px-3 py-1.5 rounded-lg">
          2,094 total events
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        {["All", "Created", "Updated", "Status", "Assigned"].map(f => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              f === "All"
                ? "bg-primary/15 border-primary/30 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-white/20"
            }`}
          >
            {f}
          </button>
        ))}
        <input
          className="ml-auto bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 w-48 transition-colors"
          placeholder="Search by user or entity…"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Event ID", "User", "Action", "Entity", "Type", "Timestamp"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground font-mono whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allAudit.map((entry, i) => {
              const tc = auditTypeCfg[entry.changeType];
              return (
                <tr key={`${entry.id}-${i}`} className={`hover:bg-white/[0.03] transition-colors ${i < allAudit.length - 1 ? "border-b border-border" : ""}`}>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{entry.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-semibold text-foreground font-mono shrink-0">
                        {entry.initials}
                      </div>
                      <span className="text-sm text-foreground">{entry.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{entry.action}</td>
                  <td className="px-4 py-3 text-xs text-primary font-mono">{entry.entityId}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium font-mono ${tc.color} ${tc.bg}`}>
                      {tc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{entry.timestamp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
