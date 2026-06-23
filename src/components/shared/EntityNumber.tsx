interface Props {
  value: string;   // CHR-0041, TSK-0188, SUB-0441
  className?: string;
}

export function EntityNumber({ value, className = "" }: Props) {
  return (
    <span className={`font-mono text-[11px] text-muted-foreground ${className}`}>
      {value}
    </span>
  );
}
