"use client";

import { getAllBanners } from "@/apis/banner";
import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import AdminTable, { AdminTableColumn } from "@/component/Admin/AdminTable";
import { AdminBanner } from "@/types/admin";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";
import CreateOrUpdate from "./CreateOrUpdate";
import DeleteBanner from "./DeleteBanner";

type DialogMode = "create" | "update" | "delete" | null;

export default function BannersPage() {
  const t = useTranslations("Admin");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedBanner, setSelectedBanner] = useState<AdminBanner | null>(
    null,
  );
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["banners"],
    queryFn: getAllBanners,
  });

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedBanner(null);
  };

  const openCreate = () => {
    setDialogMode("create");
  };

  const openUpdate = (banner: AdminBanner) => {
    setSelectedBanner(banner);
    setDialogMode("update");
  };

  const openDelete = (banner: AdminBanner) => {
    setSelectedBanner(banner);
    setDialogMode("delete");
  };

  const banners = useMemo<AdminBanner[]>(() => {
    if (!data?.data?.length) {
      return [];
    }

    return data.data
      .map((banner) => ({
        id: banner.id,
        imageUrl: banner.imageUrl ?? banner.image ?? "",
        order: Number(banner.order) || 0,
      }))
      .sort(
        (firstBanner, secondBanner) => firstBanner.order - secondBanner.order,
      );
  }, [data]);

  const columns: AdminTableColumn<AdminBanner>[] = [
    {
      key: "image",
      label: t("banners.fields.image"),
      render: (banner) => (
        <div className="flex items-center gap-4">
          <Image
            src={banner.imageUrl || "/product.webp"}
            alt={`Banner ${banner.id}`}
            width={60}
            height={60}
            className="size-14 rounded-2xl object-cover"
          />
        </div>
      ),
    },
    {
      key: "order",
      label: t("banners.fields.order"),
      render: (banner) => (
        <span className="font-semibold text-slate-900">{banner.order}</span>
      ),
    },
    {
      key: "actions",
      label: t("common.actions"),
      className: "w-36 text-center",
      render: (banner) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openUpdate(banner);
            }}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <PencilSquareIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openDelete(banner);
            }}
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
          { label: t("banners.title") },
        ]}
        title={t("banners.title")}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <PlusIcon className="size-5" />
            {t("banners.create")}
          </button>
        }
      />

      <AdminTable
        columns={columns}
        data={banners}
        getRowKey={(banner) => banner.id}
        emptyText={t("common.noData")}
        isLoading={isLoading}
      />

      <CreateOrUpdate
        closeDialog={closeDialog}
        dialogMode={dialogMode}
        selectedBanner={selectedBanner}
        handleReCallApi={refetch}
      />

      {selectedBanner && (
        <DeleteBanner
          closeDialog={closeDialog}
          open={dialogMode === "delete"}
          selectedBanner={selectedBanner}
          handleReCallApi={refetch}
        />
      )}
    </div>
  );
}
