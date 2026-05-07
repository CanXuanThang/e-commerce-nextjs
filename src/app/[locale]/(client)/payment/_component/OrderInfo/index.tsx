"use client";

import { FormProvider, useForm } from "react-hook-form";
import AddressSelector from "./AddressSelector";
import { OrderItemRequest, OrderRequest } from "@/types/order";
import { Option } from "@/types/common";
import { useTranslations } from "next-intl";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/apis/order";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/slices/common";
import { RootState } from "@/store";
import { CartItemStates } from "@/slices/cartItem";
import { useRouter } from "@/i18n/navigation";
import z from "zod";
import useGetLocalStorage from "@/hook/useGetLocalStorage";
import { User } from "@/types/auth";

export interface FormOrderValue extends OrderRequest {
  province: Option;
  district: Option;
  ward: Option;
  detailAddress: string;
}

function OrderInfo() {
  const t = useTranslations("Order");
  const dispatch = useDispatch();
  const route = useRouter();
  const { orderItems }: CartItemStates = useSelector(
    (state: RootState) => state.cartItem,
  );
  const userInfo = useGetLocalStorage<User>("user");

  const schema = z.object({
    address: z.string(),
    detailAddress: z.string().min(1, "Vui lòng nhập địa chỉ"),
    phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
    province: z.object({
      value: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
      label: z.string(),
    }),
    district: z.object({
      value: z.string().min(1, "Vui lòng chọn quận/huyện"),
      label: z.string(),
    }),
    ward: z.object({
      value: z.string().min(1, "Vui lòng chọn phường/xã"),
      label: z.string(),
    }),
    note: z
      .string()
      .trim()
      .max(1000, "Note không được quá 1000 ký tự")
      .optional()
      .transform((val) => val ?? ""),
    orderItems: z.array(z.any()).optional(),
  });
  const form = useForm<FormOrderValue>({
    defaultValues: {
      address: "",
      orderItems: [],
      phone: userInfo?.phone ?? "",
      province: { value: "", label: "" },
      district: { value: "", label: "" },
      ward: { value: "", label: "" },
      detailAddress: "",
      note: "",
    },
    // resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: (request: OrderRequest) => createOrder(request),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
    onSuccess: (payload) => {
      if (payload.success) {
        toast.success(payload.message);
        form.reset();
        route.replace("/");
      } else {
        toast.error(payload.message);
      }
    },
    onError: () => {
      toast.error(t("toast.error"));
    },
  });

  const onSubmit = (values: FormOrderValue) => {
    const item: OrderItemRequest[] = orderItems.map((x) => ({
      productVariantId: x.variant.id,
      productSizeId: x.sizeId,
      quantity: x.quantity,
      price: x.price,
    }));
    const request: OrderRequest = {
      address: `${values.detailAddress}, ${values.ward.label}, ${values.district.label}, ${values.province.label}`,
      phone: values.phone,
      orderItems: item,
      note: values.note,
    };

    createMutation.mutate(request);
  };

  return (
    <form
      className="rounded-xl p-4 border border-gray-200 bg-white md:p-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-3 pb-2 lg:flex-row">
        <div className="flex-1">
          <div className="mt-1">
            <input
              {...form.register("detailAddress")}
              placeholder={t("address")}
              className="block w-full rounded-md bg-white  px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
            {form.formState.errors.detailAddress && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.detailAddress.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mt-1">
            <input
              {...form.register("phone")}
              placeholder={t("phone")}
              className="block w-full rounded-md bg-white  px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            />
            {form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <FormProvider {...form}>
        <AddressSelector />
      </FormProvider>

      <div className="flex-1">
        <div className="mt-1">
          <textarea
            rows={5}
            {...form.register("note")}
            className="block w-full mt-3 rounded-md bg-white  px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-500 placeholder:text-back focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder={t("note")}
          />
        </div>
      </div>

      <div>
        <h2 className="text-md md:text-xl  font-bold text-black mb-3 mt-5">
          {t("paymentMethod")}
        </h2>

        <div className="flex flex-wrap items-center gap-3 rounded-md border border-gray-400 bg-white px-4 py-3 cursor-pointer sm:flex-nowrap sm:gap-4">
          <input type="radio" value="cod" checked className="h-4 w-4" />
          <ShoppingCartIcon className="size-7 shrink-0" />
          <span className="text-base text-black break-words">{t("cod")}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="w-full rounded-md cursor-pointer border border-gray-500 bg-gray-500 px-6 py-2 text-md font-semibold text-white transition hover:bg-white hover:text-gray-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
        >
          {t("btnOrder")}
        </button>
      </div>
    </form>
  );
}

export default OrderInfo;
