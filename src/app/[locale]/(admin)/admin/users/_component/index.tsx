"use client";

import { getUsers } from "@/apis/user";
import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import AdminTable, { AdminTableColumn } from "@/component/Admin/AdminTable";
import { AdminUserRecord } from "@/types/admin";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CreateOrUpdate from "./CreateOrUpdate";
import { UserResponse } from "@/types/user";
import { format } from "date-fns";
import DeleteUser from "./DeleteUser";

type DialogMode = "create" | "update" | "delete" | null;

interface Props {
  initialUsers: UserResponse[];
}

function getStatusClass(status: string) {
  return status === "active"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-200 text-slate-700";
}

export default function UsersPage({ initialUsers }: Props) {
  const t = useTranslations("Admin");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord>();

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedUser(undefined);
  };

  const openCreate = () => {
    setDialogMode("create");
  };

  const openUpdate = (user: AdminUserRecord) => {
    setSelectedUser(user);
    setDialogMode("update");
  };

  const openDelete = (user: AdminUserRecord) => {
    setSelectedUser(user);
    setDialogMode("delete");
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-users"],
    queryFn: getUsers,
    initialData: {
      success: true,
      message: "",
      data: initialUsers,
    },
  });

  const columns: AdminTableColumn<AdminUserRecord>[] = [
    {
      key: "name",
      label: t("users.fields.name"),
      render: (user) => (
        <div>
          <p className="font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      label: t("users.fields.phone"),
      render: (user) => user.phone,
    },
    {
      key: "role",
      label: t("users.fields.role"),
      render: (user) => user.role,
    },
    {
      key: "createdAt",
      label: t("users.fields.createdAt"),
      render: (user) => user.createdAt,
    },
    {
      key: "isActive",
      label: t("users.fields.status"),
      render: (user) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(user.isActive ? "active" : "inactive")}`}
        >
          {t(`status.${user.isActive ? "active" : "inactive"}`)}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      className: "w-36",
      render: (user) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openUpdate(user);
            }}
            className="rounded-xl border cursor-pointer border-slate-200 p-2 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <PencilSquareIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openDelete(user);
            }}
            className="rounded-xl border cursor-pointer border-slate-200 p-2 text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  const rows =
    (data?.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: format(user.createdAt, "dd/MM/yyyy"),
    })) as AdminUserRecord[]) ?? [];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/admin/users" },
          { label: t("users.title") },
        ]}
        title={t("users.title")}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <PlusIcon className="size-5" />
            {t("users.create")}
          </button>
        }
      />

      <AdminTable
        columns={columns}
        data={rows}
        getRowKey={(user) => user.id}
        emptyText={t("common.noData")}
        isLoading={isLoading}
        onRowClick={(user) => setSelectedUser(user)}
      />

      <CreateOrUpdate
        dialogMode={dialogMode}
        closeDialog={closeDialog}
        userSelected={selectedUser}
        recallApi={refetch}
      />

      {selectedUser && (
        <DeleteUser
          open={dialogMode === "delete"}
          closeDialog={closeDialog}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
}
