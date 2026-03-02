import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-panel">
        <h1 className="text-2xl font-bold text-ink">Unauthorized Access</h1>
        <p className="mt-2 text-sm text-muted">You do not have permission to view this route.</p>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
