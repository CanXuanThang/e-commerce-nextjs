"use client";

import { deleteBanner } from "@/apis/banner";
import AdminDialog from "@/component/Admin/AdminDialog";
import { setLoading } from "@/slices/common";
import { AdminBanner } from "@/types/admin";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  closeDialog: () => void;
  handleReCallApi: () => void;
  open: boolean;
  selectedBanner: AdminBanner;
}

function DeleteBanner({
  closeDialog,
  handleReCallApi,
  open,
  selectedBanner,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBanner(id),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (payload) => {
      if (payload.success) {
        toast.success(t("toast.deleted"));
        handleReCallApi();
        closeDialog();
      } else {
        toast.error(payload.message);
      }
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(selectedBanner.id);
  };

  return (
    <AdminDialog
      open={open}
      onClose={closeDialog}
      title={t("common.confirmDelete")}
      description={t("banners.deleteMessage", {
        name: `#${selectedBanner.order}`,
      })}
    >
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={closeDialog}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600"
        >
          {t("common.cancel")}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
        >
          {t("common.delete")}
        </button>
      </div>
    </AdminDialog>
  );
}

export default DeleteBanner;
