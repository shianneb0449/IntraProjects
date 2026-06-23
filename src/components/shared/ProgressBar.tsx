interface Props {
  value: number;   // 0–100
  showLabel?: boolean;
}

function getColor(v: number) {
  if (v === 100) return "bg-blue-400";
  if (v >= 60)  return "bg-emerald-400";
  if (v >= 30)  return "bg-amber-400";
  return "bg-red-400";
}

export function ProgressBar({ value, showLabel = true }: Props) {
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] text-muted-foreground font-mono w-7 text-right">
          {value}%
        </span>
      )}
    </div>
  );
}
