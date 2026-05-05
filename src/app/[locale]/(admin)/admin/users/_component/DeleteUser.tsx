import { deleteUser } from "@/apis/user";
import AdminDialog from "@/component/Admin/AdminDialog";
import { setLoading } from "@/slices/common";
import { AdminUserRecord } from "@/types/admin";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  open: boolean;
  closeDialog: () => void;
  selectedUser: AdminUserRecord;
}

function DeleteUser({ open, closeDialog, selectedUser }: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const handleDelete = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (payload) => {
      dispatch(setLoading(false));
      if (payload.success) {
        toast.success(payload.message);
        closeDialog();
      }
    },
    onError: (error) => {
      dispatch(setLoading(false));
      toast.error(error.message);
    },
  });

  return (
    <AdminDialog
      open={open}
      onClose={closeDialog}
      title={t("common.confirmDelete")}
      description={
        selectedUser
          ? t("users.deleteMessage", { name: selectedUser.name })
          : ""
      }
    >
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={closeDialog}
          className="rounded-md border border-slate-200 px-8 py-2 cursor-pointer text-sm font-medium text-slate-600 hover:opacity-90"
        >
          {t("common.cancel")}
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch(setLoading(true));
            handleDelete.mutate(selectedUser.id);
          }}
          className="rounded-md bg-rose-600 px-8 py-2 cursor-pointer text-sm font-semibold text-white hover:opacity-90"
        >
          {t("common.delete")}
        </button>
      </div>
    </AdminDialog>
  );
}

export default DeleteUser;
