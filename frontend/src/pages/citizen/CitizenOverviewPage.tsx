import { Car, FileText, Wallet, WalletCards } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/StatCard";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/format";

export function CitizenOverviewPage() {
  const { currentUser } = useAuth();
  const { vehicles, challans } = useAppData();
  if (!currentUser) return null;

  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser.id);
  const userChallans = challans.filter((c) => c.userId === currentUser.id);
  const pending = userChallans.filter((c) => c.status === "Pending");
  const paid = userChallans.filter((c) => c.status === "Paid");
  const pendingAmount = pending.reduce((sum, c) => sum + c.fineAmount, 0);

  return (
    <div>
      <PageHeader title="Citizen Overview" subtitle="Monitor vehicles, challans, and payment obligations." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Vehicles" value={userVehicles.length} icon={<Car size={18} />} />
        <StatCard title="Total Challans" value={userChallans.length} icon={<FileText size={18} />} />
        <StatCard title="Pending Fines" value={formatCurrency(pendingAmount)} icon={<Wallet size={18} />} tone="warning" />
        <StatCard title="Paid Fines" value={paid.length} icon={<WalletCards size={18} />} tone="success" />
      </section>
    </div>
  );
}
