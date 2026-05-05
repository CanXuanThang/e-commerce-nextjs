import { createUser } from "@/apis/user";
import AdminDialog from "@/component/Admin/AdminDialog";
import Selector from "@/component/Selector";
import { setLoading } from "@/slices/common";
import { AdminUserRecord } from "@/types/admin";
import { Option } from "@/types/common";
import { CreateUserPayload } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import z from "zod";

interface Props {
  dialogMode: string | null;
  closeDialog: () => void;
  userSelected?: AdminUserRecord;
  recallApi: () => void;
}

const initialForm: CreateUserPayload = {
  name: "",
  email: "",
  phone: "",
  role: "user",
  password: "",
};

function CreateOrUpdate({
  dialogMode,
  closeDialog,
  userSelected,
  recallApi,
}: Props) {
  const t = useTranslations("Admin");
  const dispatch = useDispatch();
  const schema = z.object({
    email: z.string().email(t("validation.invalidEmail")),
    password: z.string().min(6, t("validation.minLength", { count: 6 })),
    phone: z.string().min(1, t("validation.requiredPhone")),
    name: z.string().min(1, t("validation.requiredUserName")),
    role: z.enum(["user", "admin"]),
  });
  const optionRoles: Option[] = [
    { label: t("users.roles.admin"), value: "admin" },
    { label: t("users.roles.user"), value: "user" },
  ];
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
    handleSubmit,
  } = useForm<CreateUserPayload>({
    defaultValues: initialForm,
    resolver: zodResolver(schema),
  });

  const createUserMutation = useMutation({
    mutationFn: (request: CreateUserPayload) => createUser(request),
    onSuccess: (data) => {
      dispatch(setLoading(false));
      if (data.success) {
        toast.success(data.message);
        reset();
        closeDialog();
        recallApi();
        return;
      }
      toast.error(data.message);
    },
    onError: (error) => {
      dispatch(setLoading(false));
      toast.error(error.message);
    },
  });

  const onSubmit = (values: CreateUserPayload) => {
    dispatch(setLoading(true));
    createUserMutation.mutate(values);
  };

  useEffect(() => {
    if (dialogMode === "update" && userSelected) {
      setValue("name", userSelected.name);
      setValue("email", userSelected.email);
      setValue("phone", userSelected.phone);
      setValue("role", userSelected.role as "admin" | "user");
    }
  }, [dialogMode, setValue, userSelected]);

  return (
    <AdminDialog
      open={dialogMode === "create" || dialogMode === "update"}
      onClose={closeDialog}
      title={dialogMode === "create" ? t("users.create") : t("users.update")}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              {t("users.fields.name")}
            </span>

            <div className="mt-2">
              <input
                {...register("name")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              {t("users.fields.email")}
            </span>

            <div className="mt-2">
              <input
                type="email"
                {...register("email")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              {t("users.fields.phone")}
            </span>

            <div className="mt-2">
              <input
                {...register("phone")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />

              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">
              {t("users.fields.password")}
            </span>

            <div className="mt-2">
              <input
                {...register("password")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </label>

          {dialogMode === "create" && (
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="font-medium text-slate-700 mb-2 flex">
                {t("users.fields.role")}
              </span>
              <Selector
                handleChange={(option) =>
                  setValue("role", option.value as "admin" | "user", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                label={t("users.fields.role")}
                options={optionRoles}
                hideSearch
                value={optionRoles.find((x) => x.value === watch("role"))}
              />
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              reset();
              closeDialog();
            }}
            className="rounded-md border border-gray-500 px-8 cursor-pointer py-2 text-sm font-medium  hover:opacity-90"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-8 py-2 cursor-pointer text-sm font-medium text-white hover:opacity-90"
          >
            {t("common.save")}
          </button>
        </div>
      </form>
    </AdminDialog>
  );
}

export default CreateOrUpdate;
