import { CircleDollarSign, ShieldCheck, Users, UserSquare2 } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/StatCard";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/format";

export function AdminOverviewPage() {
  const { users } = useAuth();
  const { challans, payments } = useAppData();

  const totalUsers = users.filter((u) => u.role === "citizen").length;
  const totalOfficers = users.filter((u) => u.role === "officer").length;
  const totalViolations = challans.length;
  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <PageHeader title="Admin Overview" subtitle="System-wide metrics for TRAFFICSENSE operations." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers} icon={<Users size={18} />} />
        <StatCard title="Total Officers" value={totalOfficers} icon={<UserSquare2 size={18} />} />
        <StatCard title="Total Violations" value={totalViolations} icon={<ShieldCheck size={18} />} />
        <StatCard title="Revenue Collected" value={formatCurrency(revenue)} icon={<CircleDollarSign size={18} />} tone="success" />
      </section>
    </div>
  );
}
