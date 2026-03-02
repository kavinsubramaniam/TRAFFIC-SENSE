interface StatusBadgeProps {
  label: string;
}

export function StatusBadge({ label }: StatusBadgeProps) {
  const lower = label.toLowerCase();
  let classes = "bg-slate-100 text-slate-700";
  if (lower.includes("pending")) classes = "bg-amber-100 text-amber-800";
  if (lower.includes("paid") || lower.includes("approved")) classes = "bg-green-100 text-green-800";
  if (lower.includes("reject") || lower.includes("false")) classes = "bg-red-100 text-red-800";
  if (lower.includes("review")) classes = "bg-blue-100 text-blue-800";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${classes}`}>{label}</span>;
}
