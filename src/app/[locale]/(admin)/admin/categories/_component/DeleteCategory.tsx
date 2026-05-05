import { deleteCategory } from "@/apis/category";
import AdminDialog from "@/component/Admin/AdminDialog";
import { setLoading } from "@/slices/common";
import { AdminCategory } from "@/types/admin";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  categories: AdminCategory[];
  closeDialog: () => void;
  open: boolean;
  selectedCategory: AdminCategory;
  handleReCallApi: () => void;
}

function DeleteCategory({
  closeDialog,
  open,
  selectedCategory,
  handleReCallApi,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
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
    deleteMutation.mutate(selectedCategory.id);
  };

  return (
    <AdminDialog
      open={open}
      onClose={closeDialog}
      title={t("common.confirmDelete")}
      description={t("categories.deleteMessage", {
        name: selectedCategory.name,
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

export default DeleteCategory;
