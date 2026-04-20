"use client";

import { Product, Size, Variant } from "@/models/product";
import { addCommas } from "@/utils";
import {
  TruckIcon,
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  DocumentCurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  variants: Variant[];
  index: number;
  name: string;
  discount: number;
  handleChangeIndex: (idx: number) => void;
}

function RightContainer({
  variants,
  index,
  name,
  handleChangeIndex,
  discount,
}: Props) {
  const t = useTranslations("Product");
  const [sizeIndex, setSizeIndex] = useState(0);
  const size = variants[index]?.sizes[sizeIndex];

  const orderDescription = [
    { icon: TruckIcon, content: t("delivery") },
    { icon: CalendarDaysIcon, content: t("days") },
    { icon: DocumentCurrencyDollarIcon, content: t("payment") },
    { icon: ArrowsRightLeftIcon, content: t("exchange") },
  ];

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
                className={`w-8 h-8 flex items-center justify-center border text-sm cursor-pointer hover:border-black
                  ${
                    sizeIndex === index
                      ? "border-black text-black"
                      : "border-gray-400 text-gray-500"
                  }
                `}
              >
                {item.size}
              </button>
            ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="border px-4 py-2 text-xs font-semibold hover:bg-gray-500 hover:text-white transition">
          {t("addToCart")}
        </button>

        <button className="border px-4 py-2 bg-gray-500 text-white text-xs font-semibold hover:bg-white hover:text-gray-500 transition">
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
