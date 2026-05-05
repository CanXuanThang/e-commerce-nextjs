import { deleteOrder } from "@/apis/order";
import AdminDialog from "@/component/Admin/AdminDialog";
import { setLoading } from "@/slices/common";
import { Order } from "@/types/order";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  closeDialog: () => void;
  open: boolean;
  selectedOrder: Order;
  handleReCallApi: () => void;
}

function DeleteOrder({
  closeDialog,
  open,
  selectedOrder,
  handleReCallApi,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();

  const deleteOrderMutaion = useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onMutate: () => dispatch(setLoading(true)),
    onSuccess: (payload) => {
      if (payload.success) {
        toast.success(payload.message);
        handleReCallApi();
        closeDialog();
      } else {
        toast.error(payload.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => dispatch(setLoading(false)),
  });

  const handleDelete = () => {
    deleteOrderMutaion.mutate(selectedOrder.id);
  };

  return (
    <AdminDialog
      open={open}
      onClose={closeDialog}
      title={t("common.confirmDelete")}
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

export default DeleteOrder;
