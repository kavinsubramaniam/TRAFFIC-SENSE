import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { PageHeader } from "../../components/common/PageHeader";
import { useAppData } from "../../context/AppDataContext";

export function ViolationAnalyticsPage() {
  const { challans } = useAppData();
  const typeMap = challans.reduce<Record<string, number>>((acc, c) => {
    acc[c.violationType] = (acc[c.violationType] || 0) + 1;
    return acc;
  }, {});
  const locationMap = challans.reduce<Record<string, number>>((acc, c) => {
    acc[c.location] = (acc[c.location] || 0) + 1;
    return acc;
  }, {});

  const byType = Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  const byLocation = Object.entries(locationMap).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader title="Violation Analytics" subtitle="Traffic violation trends by category and hotspot location." />
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <h2 className="mb-3 text-base font-semibold">Violations by Type</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-20} textAnchor="end" height={70} interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f59e0b" name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
          <h2 className="mb-3 text-base font-semibold">Violations by Location</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={byLocation} dataKey="value" nameKey="name" outerRadius={110} fill="#1d4ed8" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
