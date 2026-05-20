"use client";

import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import AdminTable, { AdminTableColumn } from "@/component/Admin/AdminTable";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import DeleteOrder from "./DeleteOrder";
import UpdateOrder from "./UpdateOrder";
import { Order } from "@/types/order";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllOrders, resetCount } from "@/apis/order";
import { format } from "date-fns";
import { formatAdminCurrency } from "@/utils";
import { useDispatch } from "react-redux";
import { setNotificationCount } from "@/slices/common";

type DialogMode = "update" | "delete" | null;

function getStatusClass(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-sky-100 text-sky-700",
    shipping: "bg-violet-100 text-violet-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  };

  return styles[status] ?? "bg-slate-100 text-slate-700";
}

export default function OrdersPage() {
  const dispatch = useDispatch();
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-all-orders", pageNumber, pageSize],
    queryFn: () => getAllOrders({ pageNumber, pageSize }),
  });

  const {} = useQuery({
    queryKey: ["reset-noti"],
    queryFn: async () => {
      const res = await resetCount();

      if (res.success) {
        dispatch(setNotificationCount(0));
      }
      return;
    },
    enabled: true,
  });

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedOrder(null);
  };

  const openUpdate = (order: Order) => {
    setSelectedOrder(order);
    setDialogMode("update");
  };

  const openDelete = (order: Order) => {
    setSelectedOrder(order);
    setDialogMode("delete");
  };

  const columns: AdminTableColumn<Order>[] = [
    {
      key: "customer",
      label: t("orders.fields.customer"),
      render: (order) => (
        <div>
          <p>{order.user.name}</p>
          <p className="text-xs text-slate-500">{order.phone}</p>
        </div>
      ),
    },
    {
      key: "email",
      label: "Eamil",
      render: (order) => order.user.email,
    },
    {
      key: "total",
      label: t("orders.fields.total"),
      render: (order) => formatAdminCurrency(order.totalAmount, locale),
    },
    {
      key: "createdAt",
      label: t("orders.fields.createdAt"),
      render: (order) => format(order.createdAt, "dd/MM/yyyy"),
    },
    {
      key: "status",
      label: t("orders.fields.status"),
      render: (order) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getStatusClass(order.status)}`}
        >
          {t(`status.${order.status}`)}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      className: "w-36",
      render: (order) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openUpdate(order)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <PencilSquareIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => openDelete(order)}
            className="rounded-xl border border-slate-200 p-2 text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/admin" },
          { label: t("orders.title") },
        ]}
        title={t("orders.title")}
      />

      <AdminTable
        columns={columns}
        data={data?.data.data ?? []}
        getRowKey={(order) => order.id}
        emptyText={t("common.noData")}
        isLoading={isLoading}
        pagination={{
          pageNumber,
          pageSize,
          totalRecords: data?.data.pagination?.totalRecords ?? 0,
          totalPages: data?.data.pagination?.totalPages ?? 1,
          onPageChange: setPageNumber,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPageNumber(1);
          },
        }}
      />

      {selectedOrder && (
        <>
          <UpdateOrder
            closeDialog={closeDialog}
            open={dialogMode === "update"}
            selectedOrder={selectedOrder}
            handleReCallApi={refetch}
          />

          <DeleteOrder
            closeDialog={closeDialog}
            open={dialogMode === "delete"}
            selectedOrder={selectedOrder}
            handleReCallApi={refetch}
          />
        </>
      )}
    </div>
  );
}
