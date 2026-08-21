import type { ReactNode } from "react";
import { EmptyState } from "@/components/admin/EmptyState";

export type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  emptyMessage = "No records found.",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 align-middle text-gray-700 ${col.className ?? ""}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
