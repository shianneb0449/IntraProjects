import { useState } from "react";
import { useNavigate } from "react-router";
import { useData } from "../contexts/DataContext";
import { CharterTable } from "../features/charters/components/CharterTable";
import { CharterForm } from "../features/charters/components/CharterForm";

type View = "list" | "new";

export function ChartersPage() {
  const [view, setView] = useState<View>("list");
  const { charters, addCharter } = useData();
  const navigate = useNavigate();

  const activeCount = charters.filter(c => c.status === "Active").length;
  const onHoldCount = charters.filter(c => c.status === "On Hold").length;
  const doneCount   = charters.filter(c => c.status === "Completed").length;

  if (view === "new") {
    return (
      <div className="flex flex-col h-full">
        <CharterForm
          onClose={() => setView("list")}
          onSubmit={data => {
            addCharter({
              title: data.projectName,
              owner: data.projectLeader,
              ownerInitials: data.projectLeader.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
              status: "Draft" as any,
              priority: "Medium" as any,
              progress: 0, taskCount: 0, completedTasks: 0,
              startDate: data.startDate || "",
              targetDate: data.estimatedCompletionDate || "",
              department: "",
            });
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
          <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>Project Charters</h1>
          <p className="text-sm text-muted-foreground mt-0.5">High-level project records — not required for every project</p>
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

      <CharterTable
        charters={charters}
        onNewCharter={() => setView("new")}
        onRowClick={id => navigate(`/charters/${id}`)}
      />
    </div>
  );
}
