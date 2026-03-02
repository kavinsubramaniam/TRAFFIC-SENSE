import { ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}

export function DataTable<T>({ columns, rows, rowKey }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-card shadow-panel">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-t border-slate-100">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm text-slate-700">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
