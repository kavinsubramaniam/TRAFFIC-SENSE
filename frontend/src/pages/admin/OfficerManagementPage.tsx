import { FormEvent, useState } from "react";
import { ConfirmationAlert } from "../../components/common/ConfirmationAlert";
import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";

export function OfficerManagementPage() {
  const { users, addOfficer, removeOfficer } = useAuth();
  const [officerToRemove, setOfficerToRemove] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const officers = users.filter((u) => u.role === "officer");
  const target = officers.find((o) => o.id === officerToRemove);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = addOfficer(form);
    if (!res.ok) {
      setError(res.message || "Could not add officer.");
      return;
    }
    setError("");
    setForm({ name: "", email: "", phone: "" });
  };

  return (
    <div>
      <PageHeader title="Officer Management" subtitle="Add and remove verification officers for manual review operations." />
      <form onSubmit={onSubmit} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-4">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Officer Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <input
          type="email"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Officer Email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          required
        />
        <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Add Officer</button>
        {error && <p className="text-sm text-red-700 md:col-span-4">{error}</p>}
      </form>

      <DataTable
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Phone" },
          {
            key: "action",
            header: "Action",
            render: (r) => (
              <button onClick={() => setOfficerToRemove(r.id)} className="rounded bg-red-700 px-3 py-1 text-xs font-semibold text-white">
                Remove
              </button>
            )
          }
        ]}
        rows={officers}
        rowKey={(row) => row.id}
      />

      <ConfirmationAlert
        open={Boolean(target)}
        title="Remove Officer"
        message={target ? `Remove ${target.name} from verification officer roster?` : ""}
        confirmLabel="Remove Officer"
        onCancel={() => setOfficerToRemove(null)}
        onConfirm={() => {
          if (target) removeOfficer(target.id);
          setOfficerToRemove(null);
        }}
      />
    </div>
  );
}
