import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-panel">
        <h1 className="text-3xl font-bold text-ink">404</h1>
        <p className="mt-2 text-sm text-muted">Requested page was not found in TRAFFICSENSE portal.</p>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900">
          Go Home
        </Link>
      </div>
    </div>
  );
}
