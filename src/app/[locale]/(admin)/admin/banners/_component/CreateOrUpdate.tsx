"use client";

import { createBanner, updateBanner } from "@/apis/banner";
import AdminDialog from "@/component/Admin/AdminDialog";
import { setLoading } from "@/slices/common";
import { AdminBanner } from "@/types/admin";
import { UpdateBannerRequest } from "@/types/banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import z from "zod";

interface Props {
  closeDialog: () => void;
  dialogMode: "create" | "update" | "delete" | null;
  handleReCallApi: () => void;
  selectedBanner: AdminBanner | null;
}

interface CreateBannerItemForm {
  image: File | null;
  order: number | null;
}

interface BannerFormValues {
  items: CreateBannerItemForm[];
  image: File | null;
  order: number | null;
}

const createEmptyBannerItem = (): CreateBannerItemForm => ({
  image: null,
  order: null,
});

const initialForm: BannerFormValues = {
  items: [createEmptyBannerItem()],
  image: null,
  order: null,
};

function CreateOrUpdate({
  closeDialog,
  dialogMode,
  handleReCallApi,
  selectedBanner,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const schema = z
    .object({
      items: z
        .array(
          z.object({
            image: z.any(),
            order: z.number().nullable(),
          }),
        )
        .min(1, t("validation.minBannerItems")),
      image: z.any().nullable(),
      order: z.number().nullable(),
    })
    .superRefine((values, context) => {
      if (dialogMode === "create") {
        values.items.forEach((item, index) => {
          if (!(item.image instanceof File)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.requiredBannerImage"),
              path: ["items", index, "image"],
            });
          }

          if (!item.order || Number(item.order) < 1) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.invalidBannerOrder"),
              path: ["items", index, "order"],
            });
          }
        });
      }

      if (
        dialogMode === "update" &&
        (!values.order || Number(values.order) < 1)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.invalidBannerOrder"),
          path: ["order"],
        });
      }
    });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<BannerFormValues>({
    defaultValues: initialForm,
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: (body: FormData) => createBanner(body),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (payload) => {
      if (payload.success) {
        toast.success(t("toast.created"));
        handleReCallApi();
        closeDialog();
      } else {
        toast.error(payload.message);
      }
    },
    onError: () => {
      toast.error(t("toast.createdFailed"));
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; body: FormData }) =>
      updateBanner(data.id, data.body),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (payload) => {
      if (payload.success) {
        toast.success(payload.message);
        handleReCallApi();
        closeDialog();
      } else {
        toast.error(payload.message);
      }
    },
    onError: () => {
      toast.error(t("toast.updateFailed"));
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });

  useEffect(() => {
    if (dialogMode === "update" && selectedBanner) {
      reset({
        items: [createEmptyBannerItem()],
        image: null,
        order: selectedBanner.order,
      });
      return;
    }

    reset(initialForm);
  }, [dialogMode, reset, selectedBanner]);

  const items = watch("items");
  const selectedImage = watch("image");

  const addBannerItem = () => {
    setValue("items", [...items, createEmptyBannerItem()], {
      shouldDirty: true,
    });
  };

  const removeBannerItem = (index: number) => {
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index);

    setValue(
      "items",
      nextItems.length > 0 ? nextItems : [createEmptyBannerItem()],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const onSubmit = (values: BannerFormValues) => {
    if (dialogMode === "create") {
      const formData = new FormData();

      values.items.forEach((item) => {
        if (item.image) {
          formData.append("images", item.image);
        }
        formData.append("orders", String(item.order));
      });

      createMutation.mutate(formData);
      return;
    }

    if (dialogMode === "update" && selectedBanner) {
      const payload: UpdateBannerRequest = {
        order: Number(values.order),
      };
      const formData = new FormData();

      formData.append("order", String(payload.order));
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      updateMutation.mutate({
        id: selectedBanner.id,
        body: formData,
      });
    }
  };

  return (
    <AdminDialog
      open={dialogMode === "create" || dialogMode === "update"}
      onClose={closeDialog}
      title={
        dialogMode === "create" ? t("banners.create") : t("banners.update")
      }
    >
      <form
        key={`${dialogMode}-${selectedBanner?.id ?? "new"}`}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {dialogMode === "create" ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={addBannerItem}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
            >
              <PlusIcon className="size-4" />
              {t("banners.addItem")}
            </button>

            {items.map((_, index) => (
              <div
                key={`banner-item-${index}`}
                className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_180px_auto] md:items-end"
              >
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">
                    {t("banners.fields.image")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setValue(`items.${index}.image`, file, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white focus:border-amber-400"
                  />
                  {errors.items?.[index]?.image && (
                    <p className="text-sm text-red-500">
                      {String(errors.items[index]?.image?.message ?? "")}
                    </p>
                  )}
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-slate-700">
                    {t("banners.fields.order")}
                  </span>
                  <input
                    type="number"
                    min="1"
                    {...register(`items.${index}.order`, {
                      setValueAs: (value) =>
                        value === "" ? null : Number(value),
                    })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-400"
                  />
                  {errors.items?.[index]?.order && (
                    <p className="text-sm text-red-500">
                      {errors.items[index]?.order?.message}
                    </p>
                  )}
                </label>

                <button
                  type="button"
                  onClick={() => removeBannerItem(index)}
                  disabled={items.length === 1}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-rose-200 px-4 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {selectedBanner && (
              <div className="space-y-2 text-sm">
                <span className="font-medium text-slate-700">
                  {t("banners.currentImage")}
                </span>
                <Image
                  src={selectedBanner.imageUrl || "/product.webp"}
                  alt={`Banner ${selectedBanner.id}`}
                  width={320}
                  height={140}
                  className="h-36 w-full rounded-2xl object-cover md:w-80"
                />
              </div>
            )}

            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">
                {t("banners.replaceImage")}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setValue("image", file, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white focus:border-amber-400"
              />
              {selectedImage instanceof File && (
                <p className="text-xs text-slate-500">{selectedImage.name}</p>
              )}
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">
                {t("banners.fields.order")}
              </span>
              <input
                type="number"
                min="1"
                {...register("order", {
                  setValueAs: (value) => (value === "" ? null : Number(value)),
                })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-400"
              />
              {errors.order && (
                <p className="text-sm text-red-500">{errors.order.message}</p>
              )}
            </label>
          </div>
        )}

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
