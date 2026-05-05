"use client";

import { addCartItem } from "@/apis/cartItem";
import { AddCartItemRequest } from "@/types/cartItem";
import { Variant } from "@/types/product";
import { addCommas } from "@/utils";
import {
  TruckIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  DocumentCurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useDispatch } from "react-redux";
import { setLoading } from "@/slices/common";

interface Props {
  id: number;
  variants: Variant[];
  index: number;
  name: string;
  discount: number;
  handleChangeIndex: (idx: number) => void;
}

function RightContainer({
  id,
  variants,
  index,
  name,
  handleChangeIndex,
  discount,
}: Props) {
  const t = useTranslations("Product");
  const dispatch = useDispatch();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const size = variants[index]?.sizes[sizeIndex];
  const router = useRouter();

  const orderDescription = [
    { icon: TruckIcon, content: t("delivery") },
    { icon: CalendarDaysIcon, content: t("days") },
    { icon: DocumentCurrencyDollarIcon, content: t("payment") },
    { icon: ArrowsRightLeftIcon, content: t("exchange") },
  ];

  const { mutate } = useMutation({
    mutationFn: ({
      request,
    }: {
      request: AddCartItemRequest;
      isBuyNow: boolean;
    }) => addCartItem(request),
    onSuccess: (payload, variables) => {
      dispatch(setLoading(false));
      if (payload.success) {
        if (variables.isBuyNow) {
          router.push("/payment");
          return;
        }

        toast.success(t("addCartSuccess"));
        return;
      }

      toast.error(t("addCartFailed"));
    },
    onError: () => {
      dispatch(setLoading(false));
      toast.error(t("addCartFailed"));
    },
  });

  const handleAddToCart = (isBuyNow: boolean) => {
    if (!size) {
      toast.error(t("chooseSize"));
      return;
    }

    const request: AddCartItemRequest = {
      productId: id,
      variantId: variants[index].id,
      sizeId: size.id,
      quantity: quantity,
      price: size.price,
    };
    dispatch(setLoading(true));
    mutate({ request, isBuyNow });
  };

  return (
    <div className="flex flex-col gap-4 sticky top-[134px]">
      <span className="text-2xl font-semibold">{name}</span>

      <span className="text-xs font-semibold">
        {size.quantity > 0 ? t("inStock") : t("outOfStock")}
      </span>

      <hr />

      {discount > 0 ? (
        <div className="flex gap-3 items-end">
          <div className="relative">
            <span className="line-through text-gray-500 text-sm">
              {addCommas(size.price.toString())} VND
            </span>

            <div className="px-1 py-0.5 bg-red-500 text-white font-semibold text-[8px] absolute top-[-6px] right-[-24px] rounded-2xl">
              -{discount}%
            </div>
          </div>

          <span className="font-semibold pl-5">
            {addCommas(
              Math.round(size.price - (size.price * discount) / 100).toString(),
            )}{" "}
            VND
          </span>
        </div>
      ) : (
        <span className="font-semibold">
          {addCommas(size.price.toString())} VND
        </span>
      )}

      <div>
        <span className="text-xs font-semibold">{t("color")}</span>

        <div className="flex gap-2 mt-1">
          {variants.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                handleChangeIndex(idx);
                setSizeIndex(0);
              }}
              style={{ backgroundColor: item.colorCode }}
              className={`w-6 h-6 rounded-full border-2 transition cursor-pointer hover:border-black
                ${index === idx ? "border-black scale-110" : "border-gray-400"}
              `}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold">{t("size")}</span>

        <div className="flex gap-2 mt-1">
          {variants[index].sizes
            .filter((x) => x.quantity > 0)
            .map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSizeIndex(index)}
                className={`w-8 h-8 flex items-center justify-center border text-sm cursor-pointer hover:border-black hover:border-2
                  ${
                    sizeIndex === index
                      ? "border-black text-black border-2"
                      : "border-gray-400 text-gray-500"
                  }
                `}
              >
                {item.size}
              </button>
            ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold">{t("quantity")}</span>

        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-[30px] h-[30px] border border-r-0  ${
              quantity <= 1
                ? "border-gray-300 text-gray-300 cursor-not-allowed"
                : "border-gray-500 text-black cursor-pointer"
            }`}
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
          >
            -
          </div>

          <input
            type="number"
            min={1}
            max={size.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-[30px] h-[30px] border border-gray-500 text-sm  py-1 outline-0 flex items-center justify-center text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div
            className={`flex items-center justify-center w-[30px] h-[30px] border border-l-0 ${
              quantity >= size.quantity
                ? "border-gray-300 text-gray-300 cursor-not-allowed"
                : "border-gray-500 cursor-pointer"
            }`}
            onClick={() =>
              setQuantity((prev) => Math.min(prev + 1, size.quantity))
            }
          >
            +
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="border px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-500 hover:text-white transition"
          onClick={() => handleAddToCart(false)}
        >
          {t("addToCart")}
        </button>

        <button
          className="border px-4 py-2 bg-gray-500 text-white cursor-pointer text-xs font-semibold hover:bg-white hover:text-gray-500 transition"
          onClick={() => handleAddToCart(true)}
        >
          {t("buyNow")}
        </button>
      </div>

      <div>
        <span className="text-xs font-semibold">{t("order")}</span>

        <div className="grid grid-cols-2 gap-3 p-4 mt-2 rounded-md bg-gray-100">
          {orderDescription.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <item.icon className="w-6 h-6 p-1 border rounded" />

              <span className="text-xs">{item.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightContainer;
