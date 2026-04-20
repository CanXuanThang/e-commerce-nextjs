"use client";

import { login } from "@/apis/auth";
import { LoginRequest } from "@/models/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { _Translator, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { setCookie } from "nookies";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Ít nhất 6 ký tự"),
});

function LoginForm() {
  const t = useTranslations("Login");
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: (data) => {
      if (data.success) {
        setCookie(null, "accessToken", data.data.accessToken);
        setCookie(null, "refreshToken", data.data.refreshToken);
        router.replace("/");
        return;
      }
      toast.error(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (value: LoginRequest) => {
    await loginMutation.mutate(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6">
      <div>
        <label className="block text-sm/6 font-medium text-back">Email</label>
        <div className="mt-2">
          <input
            {...register("email")}
            className="block w-full rounded-md bg-white  px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm/6 font-medium text-back">
            {t("password")}
          </label>
          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-indigo-300 hover:text-indigo-300"
            >
              {t("forgotPassword")}
            </a>
          </div>
        </div>
        <div className="mt-2">
          <input
            {...register("password")}
            type="password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {t("title")}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
