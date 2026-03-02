import { useState } from "react";
import { ConfirmationAlert } from "../../components/common/ConfirmationAlert";
import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

export function UserManagementPage() {
  const { users, setUserActive } = useAuth();
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  const citizens = users.filter((u) => u.role === "citizen");
  const target = citizens.find((u) => u.id === targetUserId);

  return (
    <div>
      <PageHeader title="User Management" subtitle="Enable or disable citizen portal accounts." />
      <DataTable
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Phone" },
          { key: "vehicleNumber", header: "Vehicle Number" },
          { key: "active", header: "Status", render: (r) => <StatusBadge label={r.active ? "Active" : "Disabled"} /> },
          {
            key: "action",
            header: "Action",
            render: (r) => (
              <button
                onClick={() => setTargetUserId(r.id)}
                className={`rounded px-3 py-1 text-xs font-semibold ${r.active ? "bg-red-600 text-white" : "bg-green-700 text-white"}`}
              >
                {r.active ? "Disable" : "Enable"}
              </button>
            )
          }
        ]}
        rows={citizens}
        rowKey={(row) => row.id}
      />

      <ConfirmationAlert
        open={Boolean(target)}
        title={target?.active ? "Disable User Account" : "Enable User Account"}
        message={
          target
            ? `${target.active ? "Disable" : "Enable"} access for ${target.name} (${target.email})?`
            : ""
        }
        confirmLabel={target?.active ? "Disable User" : "Enable User"}
        onCancel={() => setTargetUserId(null)}
        onConfirm={() => {
          if (target) setUserActive(target.id, !target.active);
          setTargetUserId(null);
        }}
      />
    </div>
  );
}
