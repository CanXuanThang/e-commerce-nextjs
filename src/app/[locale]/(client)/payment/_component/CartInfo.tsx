"use client";

import { getCartItems } from "@/apis/cartItem";
import { setOrderItem } from "@/slices/cartItem";
import { setLoading } from "@/slices/common";
import { CartItem } from "@/types/cartItem";
import { addCommas } from "@/utils";
import {
  ArchiveBoxIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const formatPrice = (value: number) => `${addCommas(value.toString())} VND`;

const extractCartItems = (payload: CartItem[]): CartItem[] => {
  if (Array.isArray(payload)) {
    return payload as CartItem[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "items" in payload &&
    Array.isArray((payload as { items?: unknown[] }).items)
  ) {
    return (payload as { items: CartItem[] }).items;
  }

  return [];
};

function CartInfo() {
  const t = useTranslations("Order");
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const response = await getCartItems();
      return extractCartItems(response.data ?? []);
    },
    refetchOnWindowFocus: true,
  });

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [removedIds, setRemovedIds] = useState<number[]>([]);

  const mergedItems = useMemo(() => {
    const items =
      data && data.length > 0
        ? data
            .filter((item) => !removedIds.includes(item.id ?? 0))
            .map((item) => ({
              ...item,
              quantity: quantities[item.id ?? 0] ?? item.quantity,
            }))
        : [];
    dispatch(setOrderItem(items));
    return items;
  }, [data, quantities, removedIds]);

  const subtotal = mergedItems.reduce(
    (total, item) => total + (item.price ?? 0) * item.quantity,
    0,
  );

  const savings = mergedItems.reduce((total, item) => {
    if (!item.product.discount) return total;

    const originalPrice = Math.round(
      (item.price ?? 0) / Math.max(1 - item.product.discount / 100, 0.01),
    );

    return (
      total + Math.max(originalPrice - (item.price ?? 0), 0) * item.quantity
    );
  }, 0);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  if (mergedItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <ShoppingBagIcon className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="text-base font-medium text-black">
          {t("emptyCartTitle")}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {t("emptyCartDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-gray-200 bg-white">
        {mergedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="grid grid-cols-1 gap-4 p-3 sm:p-4 md:grid-cols-[112px_minmax(0,1fr)]"
          >
            <div className="flex justify-center overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={item.variant?.imgUrl ?? ""}
                alt={item.product.name}
                width={240}
                height={320}
                className="h-full w-full max-w-60 object-cover md:max-w-none"
              />
            </div>

            <div className="min-w-0 flex flex-col gap-3">
              <div className="min-w-0">
                <p className="text-md font-medium text-black break-words">
                  {item.product.name}
                </p>
                {item.product.description && (
                  <p className="py-1.5 text-xs text-black/75 break-words">
                    {item.product.description}
                  </p>
                )}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-sm text-black/75 break-words">
                    {[item.variant.colorName, item.size]
                      .filter(Boolean)
                      .join(" / ")}
                    <span
                      className="block h-4 w-4 shrink-0 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.variant.colorCode }}
                    />
                  </p>
                  <button
                    type="button"
                    className="flex w-fit cursor-pointer items-center gap-1.5 self-start text-base text-black/80 sm:self-auto"
                    onClick={() =>
                      setRemovedIds((prev) =>
                        prev.includes(item.id) ? prev : [...prev, item.id],
                      )
                    }
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                    <span className="text-sm text-red-500">{t("remove")}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex h-9 w-fit overflow-hidden rounded-full border border-gray-300 sm:items-center">
                  <button
                    type="button"
                    aria-label={t("decreaseQuantity")}
                    className={`flex h-full cursor-pointer w-9 items-center justify-center text-md md:text-xl  ${
                      item.quantity <= 1
                        ? "cursor-not-allowed text-gray-300"
                        : "cursor-pointer text-black"
                    }`}
                    onClick={() => {
                      if (item.quantity <= 1) return;

                      setQuantities((prev) => ({
                        ...prev,
                        [item.id]: Math.max(item.quantity - 1, 1),
                      }));
                    }}
                  >
                    -
                  </button>

                  <span className="flex h-full min-w-8 items-center justify-center px-3 text-base text-black">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    aria-label={t("increaseQuantity")}
                    className="flex h-full w-9 cursor-pointer items-center justify-center text-md md:text-xl  text-black"
                    onClick={() => {
                      setQuantities((prev) => ({
                        ...prev,
                        [item.id]: item.quantity + 1,
                      }));
                    }}
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center text-left text-lg font-semibold text-black sm:justify-end sm:text-right md:min-w-32">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>

            {index < mergedItems.length - 1 && (
              <div className="md:col-span-2">
                <div className="border-b border-gray-200" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <ArchiveBoxIcon className="h-5 w-5 text-black" />
          <h2 className="text-md md:text-xl font-bold leading-none text-black">
            {t("orderDetail")}
          </h2>
        </div>

        <div className="space-y-5 py-5 text-md text-black">
          <div className="flex items-start justify-between gap-4">
            <span>{t("subtotal")}</span>
            <span className="text-right">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <span>{t("shippingFee")}</span>
            <span className="text-right text-red-500">
              {t("shippingNotIncluded")}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-5">
          <div className="flex items-start justify-between gap-4 text-md">
            <span>{t("total")}</span>
            <strong className="text-right">{formatPrice(subtotal)}</strong>
          </div>

          <p className="mt-3 text-right text-sm italic text-[#ff6b00]">
            {t("savedFromOriginal", { amount: formatPrice(savings) })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartInfo;
