import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppData } from "../../context/AppDataContext";
import { formatDateTime } from "../../utils/format";

export function VerificationHistoryPage() {
  const { detections } = useAppData();
  const rows = detections.filter((d) => d.status !== "pending");

  return (
    <div>
      <PageHeader title="Verification History" subtitle="Audit trail of reviewed AI detections." />
      <DataTable
        columns={[
          { key: "id", header: "Detection ID" },
          { key: "violationType", header: "Violation Type" },
          { key: "vehicleNumber", header: "Vehicle Number" },
          { key: "datetime", header: "Reviewed Time", render: (r) => formatDateTime(r.datetime) },
          { key: "status", header: "Status", render: (r) => <StatusBadge label={r.status} /> },
          { key: "reviewedBy", header: "Reviewed By" }
        ]}
        rows={rows}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
