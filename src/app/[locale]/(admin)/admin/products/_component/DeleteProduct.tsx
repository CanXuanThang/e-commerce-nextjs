import { deleteProduct } from "@/apis/product";
import AdminDialog from "@/component/Admin/AdminDialog";
import { setLoading } from "@/slices/common";
import { Product } from "@/types/product";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  closeDialog: () => void;
  open: boolean;
  selectedProduct: Product;
}

function DeleteProduct({ closeDialog, open, selectedProduct }: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(selectedProduct.id),
    onSuccess: (payload) => {
      dispatch(setLoading(false));
      if (payload.success) {
        toast.success(t("toast.deleted"));
        closeDialog();
      } else {
        toast.error(t("toast.error"));
      }
    },
    onError: () => {
      dispatch(setLoading(false));
      toast.error(t("toast.error"));
    },
  });

  const handleDelete = () => {
    dispatch(setLoading(true));
    deleteMutation.mutate();
  };

  return (
    <AdminDialog
      open={open}
      onClose={closeDialog}
      title={t("common.confirmDelete")}
      description={t("products.deleteMessage", { name: selectedProduct.name })}
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

export default DeleteProduct;
