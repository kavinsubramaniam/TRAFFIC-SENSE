import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency, formatDateTime } from "../../utils/format";

export function PaymentHistoryPage() {
  const { currentUser } = useAuth();
  const { payments } = useAppData();
  if (!currentUser) return null;

  const rows = payments.filter((p) => p.userId === currentUser.id);

  return (
    <div>
      <PageHeader title="Payment History" subtitle="Completed e-challan payments and transaction references." />
      <DataTable
        columns={[
          { key: "challanId", header: "Challan ID" },
          { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
          { key: "transactionId", header: "Transaction ID" },
          { key: "date", header: "Date", render: (r) => formatDateTime(r.date) }
        ]}
        rows={rows}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
