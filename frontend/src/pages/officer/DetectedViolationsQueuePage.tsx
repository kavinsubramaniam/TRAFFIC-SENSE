import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "../../components/common/DataTable";
import { PageHeader } from "../../components/common/PageHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppData } from "../../context/AppDataContext";
import { formatDateTime } from "../../utils/format";

export function DetectedViolationsQueuePage() {
  const { detections } = useAppData();
  const [typeFilter, setTypeFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(() => {
    return detections.filter((d) => {
      const matchType = typeFilter === "all" || d.violationType === typeFilter;
      const matchConfidence =
        confidenceFilter === "all" ||
        (confidenceFilter === "high" && d.confidence >= 0.9) ||
        (confidenceFilter === "medium" && d.confidence >= 0.8 && d.confidence < 0.9) ||
        (confidenceFilter === "low" && d.confidence < 0.8);
      const matchDate = !dateFilter || d.datetime.startsWith(dateFilter);
      return matchType && matchConfidence && matchDate && d.status === "pending";
    });
  }, [detections, typeFilter, confidenceFilter, dateFilter]);

  const types = Array.from(new Set(detections.map((d) => d.violationType)));

  return (
    <div>
      <PageHeader title="Detected Violations Queue" subtitle="Validate AI-detected incidents before challan issuance." />
      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-4">
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All violation types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value)}
        >
          <option value="all">All confidence levels</option>
          <option value="high">High (90%+)</option>
          <option value="medium">Medium (80-89%)</option>
          <option value="low">Low (&lt;80%)</option>
        </select>
        <input
          type="date"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <DataTable
        columns={[
          { key: "violationType", header: "Violation Type" },
          { key: "vehicleNumber", header: "Vehicle Number" },
          { key: "confidence", header: "Confidence", render: (r) => `${(r.confidence * 100).toFixed(1)}%` },
          { key: "datetime", header: "Date & Time", render: (r) => formatDateTime(r.datetime) },
          { key: "location", header: "Location" },
          { key: "status", header: "Status", render: (r) => <StatusBadge label={r.status} /> },
          {
            key: "review",
            header: "Review",
            render: (r) => (
              <Link to={`/officer/review/${r.id}`} className="font-medium text-blue-700 hover:underline">
                Open Case
              </Link>
            )
          }
        ]}
        rows={filtered}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
