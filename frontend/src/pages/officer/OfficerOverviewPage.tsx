import { CheckCircle2, Clock3, ShieldX } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/StatCard";
import { useAppData } from "../../context/AppDataContext";

export function OfficerOverviewPage() {
  const { detections } = useAppData();
  const today = new Date().toISOString().slice(0, 10);
  const pending = detections.filter((d) => d.status === "pending").length;
  const approvedToday = detections.filter((d) => d.status === "approved" && d.datetime.startsWith(today)).length;
  const rejectedToday = detections.filter(
    (d) => (d.status === "rejected" || d.status === "false_positive") && d.datetime.startsWith(today)
  ).length;

  return (
    <div>
      <PageHeader title="Officer Home" subtitle="Human-in-the-loop verification operations console." />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Pending Verifications" value={pending} icon={<Clock3 size={18} />} tone="warning" />
        <StatCard title="Approved Today" value={approvedToday} icon={<CheckCircle2 size={18} />} tone="success" />
        <StatCard title="Rejected Today" value={rejectedToday} icon={<ShieldX size={18} />} tone="danger" />
      </section>
    </div>
  );
}
