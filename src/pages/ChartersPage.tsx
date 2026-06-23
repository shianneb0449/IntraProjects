import { useState } from "react";
import { CharterTable } from "../features/charters/components/CharterTable";
import { CharterForm } from "../features/charters/components/CharterForm";
import { MOCK_CHARTERS } from "../features/charters/data";

type View = "list" | "new";

export function ChartersPage() {
  const [view, setView] = useState<View>("list");
  const [charters, setCharters] = useState(MOCK_CHARTERS);

  const activeCount  = charters.filter(c => c.status === "Active").length;
  const onHoldCount  = charters.filter(c => c.status === "On Hold").length;
  const doneCount    = charters.filter(c => c.status === "Completed").length;

  if (view === "new") {
    return (
      <div className="flex flex-col h-full">
        <CharterForm
          onClose={() => setView("list")}
          onSubmit={data => {
            // In v1.0.0 this will call chartersApi.create()
            const newId = `CHR-${String(charters.length + 42).padStart(4, "0")}`;
            setCharters(prev => [...prev, {
              id: newId,
              title: data.projectName,
              owner: data.projectLeader,
              ownerInitials: data.projectLeader.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
              status: "Draft" as any,
              priority: "Medium" as any,
              progress: 0,
              taskCount: 0,
              completedTasks: 0,
              startDate: data.startDate || "",
              targetDate: data.estimatedCompletionDate || "",
              department: "",
            }]);
            setView("list");
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Project Charters
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            High-level project records — not every project requires a charter
          </p>
        </div>
        <button
          onClick={() => setView("new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New Charter
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Charters", value: charters.length },
          { label: "Active",         value: activeCount      },
          { label: "On Hold",        value: onHoldCount      },
          { label: "Completed",      value: doneCount        },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <div className="text-2xl font-semibold text-foreground font-mono">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      <CharterTable charters={charters} onNewCharter={() => setView("new")} />
    </div>
  );
}
