import { useState } from "react";
import { useNavigate } from "react-router";
import { useData } from "../contexts/DataContext";
import { CharterTable } from "../features/charters/components/CharterTable";
import type { MockCharter } from "../features/charters/data";

type View = "list" | "new";

// Map API charter to MockCharter shape for the table
function toMockCharter(c: any): MockCharter {
  const progress = c.taskCount > 0
    ? Math.round((c.completedTaskCount / c.taskCount) * 100)
    : 0;
  return {
    id: c.charterNumber,
    title: c.title,
    owner: c.ownerDisplayName,
    ownerInitials: c.ownerDisplayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
    status: c.statusCode as any,
    priority: c.priorityCode as any,
    progress,
    taskCount: c.taskCount,
    completedTasks: c.completedTaskCount,
    startDate: c.startDate ?? "",
    targetDate: c.targetDate ?? "",
    department: c.department ?? "",
  };
}

export function ChartersPage() {
  const [view, setView] = useState<View>("list");
  const { charters, chartersLoading, chartersError, addCharter, charterStatuses, priorities } = useData();
  const navigate = useNavigate();

  const mappedCharters = charters.map(toMockCharter);
  const activeCount = charters.filter(c => c.statusCode === "Active").length;
  const onHoldCount = charters.filter(c => c.statusCode === "OnHold").length;
  const doneCount   = charters.filter(c => c.statusCode === "Completed").length;

  if (view === "new") {
    return (
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("list")} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>New Project Charter</h1>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <NewCharterForm
            charterStatuses={charterStatuses}
            priorities={priorities}
            onSubmit={async (data) => {
              await addCharter(data);
              setView("list");
            }}
            onCancel={() => setView("list")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Project Charters</h1>
          <p className="text-sm text-muted-foreground mt-0.5">High-level project records</p>
        </div>
        <button onClick={() => setView("new")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Charter
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",     value: charters.length },
          { label: "Active",    value: activeCount      },
          { label: "On Hold",   value: onHoldCount      },
          { label: "Completed", value: doneCount        },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <div className="text-2xl font-semibold text-foreground font-mono">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {chartersError && (
        <div className="mb-4 px-4 py-3 bg-red-400/10 border border-red-400/20 rounded-lg text-sm text-red-400">
          {chartersError}
        </div>
      )}

      {chartersLoading ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-sm text-muted-foreground">
          Loading charters…
        </div>
      ) : (
        <CharterTable
          charters={mappedCharters}
          onNewCharter={() => setView("new")}
          onRowClick={id => {
            const charter = charters.find(c => c.charterNumber === id);
            if (charter) navigate(`/charters/${charter.charterId}`);
          }}
        />
      )}
    </div>
  );
}

// ── Inline new charter form ───────────────────────────────────────────────────

function NewCharterForm({ charterStatuses, priorities, onSubmit, onCancel }: {
  charterStatuses: any[];
  priorities: any[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", department: "", problemStatement: "", goalStatement: "",
    projectApproach: "", statusId: 2, priorityId: 3,
    startDate: "", targetDate: "",
  });

  const inp = "w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors";
  const lbl = "block text-xs text-muted-foreground mb-1.5";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        title: form.title,
        department: form.department || undefined,
        problemStatement: form.problemStatement || undefined,
        goalStatement: form.goalStatement || undefined,
        projectApproach: form.projectApproach || undefined,
        ownerUserId: 1,
        statusId: form.statusId,
        priorityId: form.priorityId,
        startDate: form.startDate || undefined,
        targetDate: form.targetDate || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={lbl}>Project name *</label>
        <input className={inp} placeholder="e.g. ERP System Migration — Phase 3" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Department</label>
          <input className={inp} placeholder="e.g. IT Infrastructure" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>Project approach</label>
          <select className={inp + " cursor-pointer"} value={form.projectApproach} onChange={e => setForm(f => ({ ...f, projectApproach: e.target.value }))}>
            <option value="">Select…</option>
            <option>Waterfall</option><option>Agile / Iterative</option>
            <option>Phased</option><option>Pilot then Rollout</option><option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className={lbl}>Problem statement</label>
        <textarea className={inp} rows={2} placeholder="What problem does this project address?" value={form.problemStatement} onChange={e => setForm(f => ({ ...f, problemStatement: e.target.value }))} />
      </div>
      <div>
        <label className={lbl}>Goal statement</label>
        <textarea className={inp} rows={2} placeholder="What does success look like?" value={form.goalStatement} onChange={e => setForm(f => ({ ...f, goalStatement: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Status</label>
          <select className={inp + " cursor-pointer"} value={form.statusId} onChange={e => setForm(f => ({ ...f, statusId: Number(e.target.value) }))}>
            {charterStatuses.map(s => <option key={s.statusId} value={s.statusId}>{s.displayName}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Priority</label>
          <select className={inp + " cursor-pointer"} value={form.priorityId} onChange={e => setForm(f => ({ ...f, priorityId: Number(e.target.value) }))}>
            {priorities.map(p => <option key={p.priorityId} value={p.priorityId}>{p.displayName}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Start date</label>
          <input type="date" className={inp} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>Target date</label>
          <input type="date" className={inp} value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          {loading ? "Creating…" : "Create Charter"}
        </button>
      </div>
    </form>
  );
}
