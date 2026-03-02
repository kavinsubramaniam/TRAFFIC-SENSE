import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "default" | "warning" | "success" | "danger";
}

export function StatCard({ title, value, icon, tone = "default" }: StatCardProps) {
  const toneMap = {
    default: "border-slate-200",
    warning: "border-amber-300",
    success: "border-green-300",
    danger: "border-red-300"
  };

  return (
    <article className={`rounded-xl border bg-card p-4 shadow-panel ${toneMap[tone]}`}>
      <div className="mb-2 flex items-center justify-between text-sm text-muted">
        <p>{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-ink">{value}</p>
    </article>
  );
}
