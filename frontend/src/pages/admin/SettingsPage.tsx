import { FormEvent, useState } from "react";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";

export function SettingsPage() {
  const { fineConfig, updateFine } = useAppData();
  const [draft, setDraft] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(fineConfig).map(([k, v]) => [k, String(v)]))
  );
  const [saved, setSaved] = useState(false);

  // Persist updated fine amounts per violation type in mock state.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    Object.entries(draft).forEach(([type, amount]) => {
      const numeric = Number(amount);
      if (!Number.isNaN(numeric) && numeric > 0) updateFine(type, numeric);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure fine amount per violation type." />
      <form onSubmit={onSubmit} className="max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-panel">
        <div className="space-y-3">
          {Object.keys(fineConfig).map((type) => (
            <label key={type} className="grid items-center gap-2 md:grid-cols-2">
              <span className="text-sm font-medium text-slate-700">{type}</span>
              <input
                type="number"
                min={1}
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={draft[type] ?? ""}
                onChange={(e) => setDraft((p) => ({ ...p, [type]: e.target.value }))}
              />
            </label>
          ))}
        </div>
        <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Save Configuration</button>
        {saved && <p className="mt-2 text-sm text-green-700">Fine configuration updated successfully.</p>}
      </form>
    </div>
  );
}
