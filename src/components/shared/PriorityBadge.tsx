import type { Priority } from "../../types/common";

const config: Record<Priority, { dot: string; text: string }> = {
  Critical: { dot: "bg-red-400",    text: "text-red-400" },
  High:     { dot: "bg-orange-400", text: "text-orange-400" },
  Medium:   { dot: "bg-amber-400",  text: "text-amber-400" },
  Low:      { dot: "bg-slate-400",  text: "text-slate-400" },
};

interface Props {
  priority: Priority;
}

export function PriorityBadge({ priority }: Props) {
  const cfg = config[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {priority}
    </span>
  );
}
