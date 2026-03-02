import { FormEvent, useMemo, useState } from "react";
import { Modal } from "../../components/common/Modal";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency, formatDateTime } from "../../utils/format";

export function PaymentPage() {
  const { currentUser } = useAuth();
  const { challans, payChallan } = useAppData();
  const [selectedChallan, setSelectedChallan] = useState("");
  const [message, setMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const pending = useMemo(
    () => challans.filter((c) => c.userId === currentUser?.id && c.status === "Pending"),
    [challans, currentUser?.id]
  );

  const challan = pending.find((c) => c.id === selectedChallan);

  const submitPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedChallan) return;
    const result = payChallan(selectedChallan, currentUser.id);
    if (!result.ok) {
      setMessage(result.message || "Payment failed");
      return;
    }
    setMessage("");
    setSuccessOpen(true);
    setSelectedChallan("");
  };

  return (
    <div>
      <PageHeader title="Payment" subtitle="Pay pending challans securely through mock e-governance payment flow." />
      <form onSubmit={submitPayment} className="max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-panel">
        <label className="mb-2 block text-sm font-medium text-slate-700">Select Pending Challan</label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={selectedChallan}
          onChange={(e) => setSelectedChallan(e.target.value)}
          required
        >
          <option value="">Choose challan</option>
          {pending.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} | {c.violationType} | {formatCurrency(c.fineAmount)}
            </option>
          ))}
        </select>

        {challan && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Violation:</span> {challan.violationType}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formatDateTime(challan.datetime)}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {challan.location}
            </p>
            <p>
              <span className="font-semibold">Payable Amount:</span> {formatCurrency(challan.fineAmount)}
            </p>
          </div>
        )}

        {message && <p className="mt-3 text-sm text-red-700">{message}</p>}
        <button className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white">Pay Now</button>
      </form>

      <Modal open={successOpen} title="Payment Successful" onClose={() => setSuccessOpen(false)}>
        <p className="text-sm text-slate-700">Your challan payment has been processed successfully.</p>
        <p className="mt-2 text-sm text-slate-700">Receipt is available in Payment History.</p>
      </Modal>
    </div>
  );
}
