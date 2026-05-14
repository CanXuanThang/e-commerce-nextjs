import { StatusOrder, updateStatusOrder } from "@/apis/order";
import AdminDialog from "@/component/Admin/AdminDialog";
import Selector from "@/component/Selector";
import { setLoading } from "@/slices/common";
import { AdminOrderStatus } from "@/types/admin";
import { Option } from "@/types/common";
import { Order } from "@/types/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import z from "zod";

interface Props {
  closeDialog: () => void;
  open: boolean;
  selectedOrder: Order;
  handleReCallApi: () => void;
}

interface OrderFormValues {
  status: StatusOrder;
}

const initialForm: OrderFormValues = {
  status: "pending",
};

function UpdateOrder({
  closeDialog,
  open,
  selectedOrder,
  handleReCallApi,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const schema = z.object({
    status: z.enum(["pending", "shipping", "completed", "cancelled"]),
  });
  const statusOptions: Option[] = [
    { label: t("status.pending"), value: "pending" },
    { label: t("status.shipping"), value: "shipping" },
    { label: t("status.completed"), value: "completed" },
    { label: t("status.cancelled"), value: "cancelled" },
  ];
  const {
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<OrderFormValues>({
    defaultValues: initialForm,
    resolver: zodResolver(schema),
  });

  const updateMutation = useMutation({
    mutationFn: (request: { id: number; status: StatusOrder }) =>
      updateStatusOrder(request.id, request.status),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (payload) => {
      if (payload.success) {
        toast.success(payload.message);
        reset();
        handleReCallApi();
        closeDialog();
      } else {
        toast.error(payload.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });

  useEffect(() => {
    if (open) {
      reset({ status: selectedOrder.status });
    }
  }, [open, reset, selectedOrder]);

  const onSubmit = (values: OrderFormValues) => {
    const request = { id: selectedOrder.id, status: values.status };

    updateMutation.mutate(request);
  };

  return (
    <AdminDialog open={open} onClose={closeDialog} title={t("orders.update")}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">
            {selectedOrder.user.name}
          </p>
          <p className="mt-1">{selectedOrder.address}</p>
        </div>

        <label className="space-y-2 text-sm">
          <span className="mb-2 flex font-medium text-slate-700">
            {t("orders.fields.status")}
          </span>
          <Selector
            handleChange={(option) =>
              setValue("status", option.value as StatusOrder, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            hideSearch
            label={t("orders.fields.status")}
            options={statusOptions}
            value={
              statusOptions.find(
                (option) => option.value === watch("status"),
              ) ?? null
            }
          />
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </label>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            {t("common.save")}
          </button>
        </div>
      </form>
    </AdminDialog>
  );
}

export default UpdateOrder;
