"use client";

import { ReactNode } from "react";

export interface AdminTableColumn<T> {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface Props<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  emptyText: string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export default function AdminTable<T>({
  columns,
  data,
  getRowKey,
  emptyText,
  onRowClick,
  isLoading,
}: Props<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-3 text-left text-sm ${column.className ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={getRowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={
                    onRowClick
                      ? "cursor-pointer transition hover:bg-gray-100"
                      : "hover:bg-gray-100"
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3 py-4 text-sm text-slate-700  ${column.className ?? ""}`}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
