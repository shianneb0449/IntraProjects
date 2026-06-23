import { useState } from "react";
import { MOCK_CHARTERS } from "../features/charters/data";
import { CharterTable } from "../features/charters/components/CharterTable";
import { NewCharterModal } from "../features/charters/components/NewCharterModal";

export function ChartersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [charters, setCharters] = useState(MOCK_CHARTERS);

  function handleCreate(values: {
    title: string; department: string; owner: string;
    priority: string; status: string; startDate: string;
    targetDate: string; description: string;
  }) {
    // In v1.0.0 this will call chartersApi.create()
    const newId = `CHR-${String(charters.length + 42).padStart(4, "0")}`;
    setCharters(prev => [...prev, {
      id: newId,
      title: values.title,
      owner: values.owner,
      ownerInitials: values.owner.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      status: values.status as any,
      priority: values.priority as any,
      progress: 0,
      taskCount: 0,
      completedTasks: 0,
      startDate: values.startDate || new Date().toISOString().split("T")[0],
      targetDate: values.targetDate || "",
      department: values.department,
    }]);
  }

  const activeCount  = charters.filter(c => c.status === "Active").length;
  const onHoldCount  = charters.filter(c => c.status === "On Hold").length;
  const doneCount    = charters.filter(c => c.status === "Completed").length;

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Project Charters
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all project charters across the organisation
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New Charter
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Charters", value: charters.length, mono: false },
          { label: "Active",         value: activeCount,     mono: false },
          { label: "On Hold",        value: onHoldCount,     mono: false },
          { label: "Completed",      value: doneCount,       mono: false },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <div className="text-2xl font-semibold text-foreground font-mono">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charter table */}
      <CharterTable charters={charters} onNewCharter={() => setModalOpen(true)} />

      {/* New charter modal */}
      <NewCharterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
