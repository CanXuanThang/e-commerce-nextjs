import { createCategory, updateCategory } from "@/apis/category";
import AdminDialog from "@/component/Admin/AdminDialog";
import Selector from "@/component/Selector";
import { setLoading } from "@/slices/common";
import { AdminCategory } from "@/types/admin";
import { CategoryResponse, UpdateCategoryRequest } from "@/types/category";
import { Option } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import z from "zod";

interface Props {
  closeDialog: () => void;
  dialogMode: "create" | "update" | "delete" | null;
  selectedCategory: AdminCategory | null;
  categories: CategoryResponse[];
  handleReCallApi: () => void;
}

const initialForm: UpdateCategoryRequest = {
  name: "",
  parentId: null,
};

function CreateOrUpdate({
  categories,
  closeDialog,
  dialogMode,
  selectedCategory,
  handleReCallApi,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const schema = z.object({
    name: z.string().min(1, t("validation.requiredCategoryName")),
    parentId: z.number().nullable(),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<UpdateCategoryRequest>({
    defaultValues: initialForm,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (dialogMode === "update" && selectedCategory) {
      reset({
        name: selectedCategory.name,
        parentId:
          categories.find((c) =>
            c.children?.some((child) => child.id === selectedCategory.id),
          )?.id ?? null,
      });
      return;
    }

    reset(initialForm);
  }, [dialogMode, reset, selectedCategory]);

  const createMutation = useMutation({
    mutationFn: (body: UpdateCategoryRequest) => createCategory(body),
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
    mutationFn: (data: { id: number; body: UpdateCategoryRequest }) =>
      updateCategory(data.id, data.body),
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

  const onSubmit = (values: UpdateCategoryRequest) => {
    if (dialogMode === "create") {
      createMutation.mutate(values);
      return;
    }

    if (dialogMode === "update" && selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, body: values });
    }
  };

  const categoryOptions: Option[] = useMemo(() => {
    const options: Option[] = categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
    return options;
  }, [categories, t]);

  return (
    <AdminDialog
      open={dialogMode === "create" || dialogMode === "update"}
      onClose={closeDialog}
      title={
        dialogMode === "create"
          ? t("categories.create")
          : t("categories.update")
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              {t("categories.fields.name")}
            </span>
            <input
              {...register("name")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-400"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </label>

          <label className="space-y-2 text-sm">
            <span className="mb-2 flex font-medium text-slate-700">
              {t("categories.fields.parentCategory.label")}
            </span>
            <Selector
              handleChange={(option) =>
                setValue("parentId", Number(option.value), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              hideSearch
              label={t("categories.fields.parentCategory.placeholder")}
              options={categoryOptions}
              value={
                categoryOptions.find(
                  (option) => option.value === watch("parentId"),
                ) ?? null
              }
            />
            {errors.parentId && (
              <p className="text-sm text-red-500">{errors.parentId.message}</p>
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
