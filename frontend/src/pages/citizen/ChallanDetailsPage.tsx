import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency, formatDateTime } from "../../utils/format";

export function ChallanDetailsPage() {
  const { challanId } = useParams();
  const { challans } = useAppData();
  const challan = challans.find((c) => c.id === challanId);

  if (!challan) {
    return (
      <div>
        <PageHeader title="Challan Details" subtitle="No record found for this challan ID." />
        <Link to="/citizen/challans" className="text-blue-700 hover:underline">
          Back to challans
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`Challan ${challan.id}`} subtitle="Detailed AI evidence and metadata for enforcement review." />
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Violation Images</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {challan.imageUrls.map((url) => (
              <img key={url} src={url} alt="Violation capture" className="h-48 w-full rounded-lg object-cover" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <h2 className="mb-3 text-lg font-semibold">Case Summary</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Type:</span> {challan.violationType}
            </p>
            <p>
              <span className="font-semibold">Status:</span> <StatusBadge label={challan.status} />
            </p>
            <p>
              <span className="font-semibold">Fine:</span> {formatCurrency(challan.fineAmount)}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formatDateTime(challan.datetime)}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {challan.location}
            </p>
            <p>
              <span className="font-semibold">Detection Confidence:</span> {(challan.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </section>
      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
        <h2 className="mb-3 text-lg font-semibold">AI Metadata</h2>
        <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-3">
          <p>
            <span className="font-semibold">Speed:</span> {challan.metadata.speedKmph} km/h
          </p>
          <p>
            <span className="font-semibold">Signal State:</span> {challan.metadata.signalState}
          </p>
          <p>
            <span className="font-semibold">Helmet Detected:</span> {challan.metadata.helmetDetected ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Seatbelt Detected:</span> {challan.metadata.seatbeltDetected ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Lane Discipline:</span> {challan.metadata.laneDiscipline}
          </p>
        </div>
      </section>
    </div>
  );
}
