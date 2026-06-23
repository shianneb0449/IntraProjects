import { CheckCircle2, Circle, PauseCircle, XCircle } from "lucide-react";
import type { CharterStatus } from "../../types/charter";
import type { TaskStatus } from "../../types/task";

type AnyStatus = CharterStatus | TaskStatus;

const config: Record<string, { icon: React.ElementType; className: string }> = {
  Active:        { icon: CheckCircle2, className: "text-emerald-400 bg-emerald-400/10" },
  "In Progress": { icon: CheckCircle2, className: "text-emerald-400 bg-emerald-400/10" },
  "On Hold":     { icon: PauseCircle,  className: "text-amber-400 bg-amber-400/10" },
  Blocked:       { icon: PauseCircle,  className: "text-amber-400 bg-amber-400/10" },
  Planning:      { icon: Circle,       className: "text-slate-400 bg-slate-400/10" },
  "Not Started": { icon: Circle,       className: "text-slate-400 bg-slate-400/10" },
  Completed:     { icon: CheckCircle2, className: "text-blue-400 bg-blue-400/10" },
  Done:          { icon: CheckCircle2, className: "text-blue-400 bg-blue-400/10" },
  Cancelled:     { icon: XCircle,      className: "text-red-400 bg-red-400/10" },
};

interface Props {
  status: AnyStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: Props) {
  const cfg = config[status] ?? config["Planning"];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-medium font-mono ${cfg.className} ${
        size === "sm" ? "text-[10px]" : "text-[11px]"
      }`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {status}
    </span>
  );
}
