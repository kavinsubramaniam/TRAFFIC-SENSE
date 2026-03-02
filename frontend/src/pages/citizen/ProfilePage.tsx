import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";

export function ProfilePage() {
  const { currentUser } = useAuth();
  const { vehicles } = useAppData();
  if (!currentUser) return null;

  const rows = vehicles.filter((v) => v.ownerId === currentUser.id);

  return (
    <div>
      <PageHeader title="Citizen Profile" subtitle="Account profile and linked vehicle registration summary." />
      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-panel">
        <h2 className="mb-3 text-lg font-semibold">User Details</h2>
        <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          <p>
            <span className="font-semibold">Name:</span> {currentUser.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {currentUser.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {currentUser.phone}
          </p>
          <p>
            <span className="font-semibold">Primary Vehicle:</span> {currentUser.vehicleNumber || "N/A"}
          </p>
        </div>
      </section>

      <h2 className="mb-2 text-lg font-semibold">Registered Vehicles</h2>
      <DataTable
        columns={[
          { key: "number", header: "Vehicle Number" },
          { key: "type", header: "Type" },
          { key: "registrationDate", header: "Registration Date" }
        ]}
        rows={rows}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
