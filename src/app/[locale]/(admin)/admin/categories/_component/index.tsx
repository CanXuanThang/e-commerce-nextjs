"use client";

import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import AdminTable, { AdminTableColumn } from "@/component/Admin/AdminTable";
import { AdminCategory } from "@/types/admin";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import CreateOrUpdate from "./CreateOrUpdate";
import DeleteCategory from "./DeleteCategory";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/apis/category";

type DialogMode = "create" | "update" | "delete" | null;

export default function CategoriesPage() {
  const t = useTranslations("Admin");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedCategory(null);
  };

  const openCreate = () => {
    setDialogMode("create");
  };

  const openUpdate = (category: AdminCategory) => {
    setSelectedCategory(category);
    setDialogMode("update");
  };

  const openDelete = (category: AdminCategory) => {
    setSelectedCategory(category);
    setDialogMode("delete");
  };

  const categories = useMemo(() => {
    if (data && data.data.length > 0) {
      return data.data;
    }
    return [];
  }, [data]);

  const columns: AdminTableColumn<AdminCategory>[] = [
    {
      key: "name",
      label: t("categories.fields.name"),
      render: (category) => (
        <p className="font-semibold text-slate-900">{category.name}</p>
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      className: "w-36",
      render: (category) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openUpdate(category)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <PencilSquareIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => openDelete(category)}
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
          { label: t("breadcrumb.home"), href: "/admin/users" },
          { label: t("categories.title") },
        ]}
        title={t("categories.title")}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <PlusIcon className="size-5" />
            {t("categories.create")}
          </button>
        }
      />

      <AdminTable
        columns={columns}
        data={categories}
        getRowKey={(category) => category.id}
        emptyText={t("common.noData")}
        isLoading={isLoading}
      />

      <CreateOrUpdate
        categories={categories}
        closeDialog={closeDialog}
        dialogMode={dialogMode}
        selectedCategory={selectedCategory}
        handleReCallApi={refetch}
      />

      {selectedCategory && (
        <DeleteCategory
          closeDialog={closeDialog}
          open={dialogMode === "delete"}
          categories={categories}
          selectedCategory={selectedCategory}
          handleReCallApi={refetch}
        />
      )}
    </div>
  );
}
