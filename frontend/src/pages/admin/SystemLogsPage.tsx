import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";
import { formatDateTime } from "../../utils/format";

export function SystemLogsPage() {
  const { logs } = useAppData();
  return (
    <div>
      <PageHeader title="System Logs" subtitle="UI-only event stream for detections, approvals, and payments." />
      <DataTable
        columns={[
          { key: "timestamp", header: "Timestamp", render: (r) => formatDateTime(r.timestamp) },
          { key: "type", header: "Event Type" },
          { key: "message", header: "Message" }
        ]}
        rows={logs}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
