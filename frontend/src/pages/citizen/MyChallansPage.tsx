import { Link } from "react-router-dom";
import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency, formatDateTime } from "../../utils/format";

export function MyChallansPage() {
  const { currentUser } = useAuth();
  const { challans } = useAppData();
  if (!currentUser) return null;
  const rows = challans.filter((c) => c.userId === currentUser.id);

  return (
    <div>
      <PageHeader title="My Challans" subtitle="Review detected violations and payment status." />
      <DataTable
        columns={[
          { key: "violationType", header: "Violation Type" },
          { key: "datetime", header: "Date & Time", render: (r) => formatDateTime(r.datetime) },
          { key: "location", header: "Location" },
          { key: "status", header: "Status", render: (r) => <StatusBadge label={r.status} /> },
          { key: "fineAmount", header: "Fine Amount", render: (r) => formatCurrency(r.fineAmount) },
          {
            key: "action",
            header: "Action",
            render: (r) => (
              <Link to={`/citizen/challans/${r.id}`} className="font-medium text-blue-700 hover:underline">
                View Details
              </Link>
            )
          }
        ]}
        rows={rows}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
