import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/format";

export function MyVehiclesPage() {
  const { currentUser } = useAuth();
  const { vehicles } = useAppData();
  if (!currentUser) return null;

  const rows = vehicles.filter((v) => v.ownerId === currentUser.id);

  return (
    <div>
      <PageHeader title="My Vehicles" subtitle="Registered vehicles linked to your citizen account." />
      <DataTable
        columns={[
          { key: "number", header: "Vehicle Number" },
          { key: "type", header: "Type" },
          { key: "registrationDate", header: "Registration Date", render: (r) => formatDate(r.registrationDate) }
        ]}
        rows={rows}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
