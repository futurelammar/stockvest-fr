import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "emerald" | "gold";
}) {
  const iconBg =
    tone === "emerald"
      ? "bg-[#1F6F4F]/10 text-[#1F6F4F]"
      : tone === "gold"
      ? "bg-[#C9A24B]/10 text-[#C9A24B]"
      : "bg-[#0E1A17]/5 text-[#0E1A17]";

  return (
    <div className="rounded-xl border border-[#E5E0D4] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-[#5B6661]">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-[#0E1A17]">{value}</p>
    </div>
  );
}