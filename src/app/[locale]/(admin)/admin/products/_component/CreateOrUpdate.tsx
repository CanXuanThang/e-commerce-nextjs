import { createProduct, updateProduct } from "@/apis/product";
import AdminDialog from "@/component/Admin/AdminDialog";
import Selector from "@/component/Selector";
import { setLoading } from "@/slices/common";
import { Option } from "@/types/common";
import { Product, UpdateProductRequest } from "@/types/product";
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
  dialogMode: "create" | "update" | "delete" | null;
  selectedCategoryId: string;
  selectedProduct: Product | null;
  categoryOptions: Option[];
}

const initialForm: UpdateProductRequest = {
  name: "",
  discount: 0,
  categoryId: 0,
  description: "",
};

function CreateOrUpdate({
  closeDialog,
  dialogMode,
  selectedCategoryId,
  selectedProduct,
  categoryOptions,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const schema = z.object({
    name: z.string().min(1, t("validation.requiredProductName")),
    categoryId: z.number().min(1, t("validation.requiredCategory")),
    discount: z
      .number()
      .refine(
        (value) => !Number.isNaN(Number(value)) && Number(value) >= 0,
        t("validation.invalidDiscount"),
      ),
    description: z.string().min(1, t("validation.requiredDescription")),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<UpdateProductRequest>({
    defaultValues: initialForm,
    resolver: zodResolver(schema),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateProductRequest;
    }) => updateProduct(id, payload),
    onSuccess: (payload) => {
      dispatch(setLoading(false));
      if (payload.success) {
        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
      closeDialog();
    },
    onError: (error) => {
      dispatch(setLoading(false));
      toast.error(error.message);
      closeDialog();
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (payload: UpdateProductRequest) => createProduct(payload),
    onSuccess: (payload) => {
      dispatch(setLoading(false));
      if (payload.success) {
        toast.success(payload.message);
      } else {
        toast.error(payload.message);
      }
      closeDialog();
    },
    onError: (error) => {
      dispatch(setLoading(false));
      toast.error(error.message);
      closeDialog();
    },
  });

  const onSubmit = (values: UpdateProductRequest) => {
    dispatch(setLoading(true));
    const normalizedProduct = {
      name: values.name,
      categoryId: Number(values.categoryId),
      description: values.description,
      discount: Number(values.discount),
    };

    if (dialogMode === "create") {
      createProductMutation.mutate(normalizedProduct);
      toast.success(t("toast.created"));
      closeDialog();
      return;
    }

    if (dialogMode === "update" && selectedProduct) {
      updateProductMutation.mutate({
        id: selectedProduct.id,
        payload: normalizedProduct,
      });
      toast.success(t("toast.updated"));
      closeDialog();
    }
  };

  useEffect(() => {
    if (dialogMode === "update" && selectedProduct) {
      reset({
        name: selectedProduct.name,
        categoryId:
          selectedProduct.categoryId ?? selectedProduct.category?.id ?? 0,
        description: selectedProduct.description,
        discount: selectedProduct.discount,
      });
      return;
    }

    if (dialogMode === "create") {
      reset({
        ...initialForm,
        categoryId: Number(selectedCategoryId) || 0,
      });
      return;
    }

    reset(initialForm);
  }, [dialogMode, reset, selectedCategoryId, selectedProduct]);

  return (
    <AdminDialog
      open={dialogMode === "create" || dialogMode === "update"}
      onClose={closeDialog}
      title={
        dialogMode === "create" ? t("products.create") : t("products.update")
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-slate-700">
              {t("products.fields.name")}
            </span>
            <input
              {...register("name")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              {t("products.fields.category")}
            </span>
            <Selector
              handleChange={(option) =>
                setValue("categoryId", Number(option.value), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              label={t("products.selectCategory")}
              options={categoryOptions}
              value={
                categoryOptions.find(
                  (option) => Number(option.value) === watch("categoryId"),
                ) ?? null
              }
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              {t("products.fields.discount")}
            </span>
            <input
              type="number"
              min="0"
              {...register("discount", { valueAsNumber: true })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
            />
            {errors.discount && (
              <p className="text-sm text-red-500">{errors.discount.message}</p>
            )}
          </label>

          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-slate-700">
              {t("products.fields.description")}
            </span>
            <textarea
              rows={5}
              {...register("description")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              reset(initialForm);
              closeDialog();
            }}
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

export default CreateOrUpdate;
