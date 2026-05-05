"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { EditableProductVariant } from "./types";
import FormattedNumberInput from "@/component/FormattedNumberInput";

interface Props {
  variant: EditableProductVariant;
  onAddSize: () => void;
  onRemoveSize: (sizeIndex: number) => void;
  onUpdateSize: (
    sizeIndex: number,
    field: "size" | "quantity" | "price",
    value: number | string,
  ) => void;
}

export default function VariantSizesEditor({
  variant,
  onAddSize,
  onRemoveSize,
  onUpdateSize,
}: Props) {
  const t = useTranslations("Admin");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-base font-semibold text-slate-900">
            {t("productDetail.sizes")}
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            {t("productDetail.sizesHint")}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSize}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
        >
          <PlusIcon className="size-4" />
          {t("productDetail.addSize")}
        </button>
      </div>

      <div className="space-y-3">
        {variant.sizes.map((size, sizeIndex) => (
          <div
            key={`size-${size.id ?? sizeIndex}`}
            className="grid grid-cols-1 gap-3 rounded-2xl border w-full border-slate-200 p-4 md:grid-cols-3 relative"
          >
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">
                {t("products.size")}
              </span>
              <input
                value={size.size}
                onChange={(event) =>
                  onUpdateSize(sizeIndex, "size", event.target.value)
                }
                placeholder={t("products.size")}
                className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-500">
                {t("products.fields.quantity")}
              </span>
              <FormattedNumberInput
                value={size.quantity}
                onChange={(value) => onUpdateSize(sizeIndex, "quantity", value)}
                placeholder={t("products.fields.stock")}
                className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-500">
                {t("products.fields.price")}
              </span>
              <FormattedNumberInput
                value={size.price}
                onChange={(value) => onUpdateSize(sizeIndex, "price", value)}
                placeholder={t("products.fields.price")}
                className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
              />
            </div>

            <div className="absolute top-[-8px] right-0">
              <button
                type="button"
                onClick={() => onRemoveSize(sizeIndex)}
                className="inline-flex bg-white cursor-pointer items-center justify-center rounded-xl border border-rose-200 px-1 py-1 text-rose-600 transition hover:bg-rose-50"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
