import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmationAlert } from "../../components/common/ConfirmationAlert";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { DetectionStatus } from "../../types";
import { formatDateTime } from "../../utils/format";

export function ViolationReviewPage() {
  const { detectionId } = useParams();
  const { detections, reviewDetection } = useAppData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [pendingAction, setPendingAction] = useState<Exclude<DetectionStatus, "pending"> | null>(null);
  const detection = detections.find((d) => d.id === detectionId);

  if (!detection) {
    return <PageHeader title="Violation Review" subtitle="Detection record not found." />;
  }

  const actionLabel: Record<Exclude<DetectionStatus, "pending">, string> = {
    approved: "Approve Violation",
    rejected: "Reject Violation",
    false_positive: "Mark as False Positive"
  };

  const executeAction = () => {
    if (!pendingAction || !currentUser) return;
    reviewDetection(detection.id, pendingAction, currentUser.name);
    setPendingAction(null);
    navigate("/officer/history");
  };

  return (
    <div>
      <PageHeader title={`Review Case ${detection.id}`} subtitle="Verify evidence and confirm enforcement decision." />
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Captured Evidence</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {detection.imageUrls.map((url) => (
              <img key={url} src={url} alt="Detected violation" className="h-52 w-full rounded-lg object-cover" />
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <h2 className="mb-3 text-lg font-semibold">AI Summary</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Violation Type:</span> {detection.violationType}
            </p>
            <p>
              <span className="font-semibold">Confidence:</span> {(detection.confidence * 100).toFixed(1)}%
            </p>
            <p>
              <span className="font-semibold">Timestamp:</span> {formatDateTime(detection.datetime)}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {detection.location}
            </p>
            <p>
              <span className="font-semibold">Speed:</span> {detection.metadata.speedKmph} km/h
            </p>
            <p>
              <span className="font-semibold">Signal:</span> {detection.metadata.signalState}
            </p>
          </div>
        </article>
      </section>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setPendingAction("approved")} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white">
          Approve Violation
        </button>
        <button onClick={() => setPendingAction("rejected")} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white">
          Reject Violation
        </button>
        <button onClick={() => setPendingAction("false_positive")} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white">
          Mark as False Positive
        </button>
      </div>

      <ConfirmationAlert
        open={Boolean(pendingAction)}
        title="Confirm verification decision"
        message={pendingAction ? `Proceed to ${actionLabel[pendingAction]} for case ${detection.id}?` : ""}
        confirmLabel={pendingAction ? actionLabel[pendingAction] : "Confirm"}
        onCancel={() => setPendingAction(null)}
        onConfirm={executeAction}
      />
    </div>
  );
}
