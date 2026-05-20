"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export interface AdminTableColumn<T> {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => ReactNode;
}

export interface AdminTablePagination {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

interface Props<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  emptyText: string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  pagination?: AdminTablePagination;
}

export default function AdminTable<T>({
  columns,
  data,
  getRowKey,
  emptyText,
  onRowClick,
  isLoading,
  pagination,
}: Props<T>) {
  const t = useTranslations("Admin");
  const pageSizeOptions = pagination?.pageSizeOptions ?? [10, 20, 50];

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

      {pagination && (
        <div className="flex flex-col gap-3 rounded-b-3xl border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            {t("pagination.showing", {
              current: data.length,
              total: pagination.totalRecords,
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {t("pagination.pageSize")}
            </label>
            <select
              value={pagination.pageSize}
              onChange={(event) =>
                pagination.onPageSizeChange?.(Number(event.target.value))
              }
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              disabled={!pagination.onPageSizeChange}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={pagination.pageNumber <= 1}
              onClick={() =>
                pagination.onPageChange(Math.max(1, pagination.pageNumber - 1))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
            >
              {t("pagination.previous")}
            </button>

            <span className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
              {pagination.pageNumber} / {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.pageNumber >= pagination.totalPages}
              onClick={() =>
                pagination.onPageChange(
                  Math.min(pagination.totalPages, pagination.pageNumber + 1),
                )
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
            >
              {t("pagination.next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
