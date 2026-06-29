import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export function PriceChangeBadge({ changePercent }: { changePercent: number }) {
  const isUp = changePercent > 0;
  const isFlat = changePercent === 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs ${
        isFlat
          ? "bg-muted text-muted-foreground"
          : isUp
          ? "bg-brand-emerald/10 text-brand-emerald"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {isFlat ? <Minus className="h-3 w-3" /> : isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(changePercent).toFixed(2)}%
    </span>
  );
}