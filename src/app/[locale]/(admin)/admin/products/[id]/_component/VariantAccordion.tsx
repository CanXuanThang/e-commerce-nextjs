"use client";

import {
  ChevronDownIcon,
  PhotoIcon,
  Squares2X2Icon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useState } from "react";
import VariantImagesEditor from "./VariantImagesEditor";
import VariantSizesEditor from "./VariantSizesEditor";
import { EditableProductImage, EditableProductVariant } from "./types";

interface Props {
  variant: EditableProductVariant;
  variantIndex: number;
  defaultOpen?: boolean;
  onSetDefaultVariant: () => void;
  onRemoveVariant: () => void;
  onUpdateVariantField: (
    field: "colorName" | "colorCode" | "sku",
    value: string,
  ) => void;
  onAddSize: () => void;
  onRemoveSize: (sizeIndex: number) => void;
  onUpdateSize: (
    sizeIndex: number,
    field: "size" | "quantity" | "price",
    value: number | string,
  ) => void;
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (imageIndex: number) => void;
  onSetPrimaryImage: (imageIndex: number) => void;
  onUpdateImage: (
    imageIndex: number,
    field: keyof EditableProductImage,
    value: number | string | boolean | File | undefined,
  ) => void;
}

export default function VariantAccordion({
  variant,
  variantIndex,
  defaultOpen = false,
  onSetDefaultVariant,
  onRemoveVariant,
  onUpdateVariantField,
  onAddSize,
  onRemoveSize,
  onUpdateSize,
  onAddImages,
  onRemoveImage,
  onSetPrimaryImage,
  onUpdateImage,
}: Props) {
  const t = useTranslations("Admin");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<"sizes" | "images">("sizes");

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full cursor-pointer flex-col gap-4 p-5 text-left sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">
              {t("productDetail.variantTitle", { index: variantIndex + 1 })}
            </h3>
            {variant.isDefault ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {t("productDetail.defaultVariant")}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-slate-500">
            {variant.colorName || t("productDetail.emptyVariantName")}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-sm text-slate-500">{variant.sku || "SKU"}</span>
          <ChevronDownIcon
            className={`size-5 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen ? (
        <div className="space-y-5 border-t border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">
                {t("productDetail.fields.colorName")}
              </span>
              <input
                value={variant.colorName}
                onChange={(event) =>
                  onUpdateVariantField("colorName", event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">
                {t("productDetail.fields.colorCode")}
              </span>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={variant.colorCode}
                  onChange={(event) =>
                    onUpdateVariantField("colorCode", event.target.value)
                  }
                  className="h-11 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                />
                <input
                  value={variant.colorCode}
                  onChange={(event) =>
                    onUpdateVariantField("colorCode", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
                />
              </div>
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="font-medium text-slate-700">
                {t("products.fields.sku")}
              </span>
              <input
                value={variant.sku}
                onChange={(event) => onUpdateVariantField("sku", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("sizes")}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  activeTab === "sizes"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                <Squares2X2Icon className="size-4" />
                {t("productDetail.tabSizes")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("images")}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  activeTab === "images"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                <PhotoIcon className="size-4" />
                {t("productDetail.tabImages")}
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onSetDefaultVariant}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  variant.isDefault
                    ? "cursor-pointer bg-emerald-100 text-emerald-700"
                    : "cursor-pointer border border-slate-200 text-slate-600 hover:border-emerald-300"
                }`}
              >
                {t("productDetail.defaultVariant")}
              </button>

              <button
                type="button"
                onClick={onRemoveVariant}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <TrashIcon className="size-4" />
                {t("productDetail.removeVariant")}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-4">
            {activeTab === "sizes" ? (
              <VariantSizesEditor
                variant={variant}
                onAddSize={onAddSize}
                onRemoveSize={onRemoveSize}
                onUpdateSize={onUpdateSize}
              />
            ) : (
              <VariantImagesEditor
                variant={variant}
                onAddImages={onAddImages}
                onRemoveImage={onRemoveImage}
                onSetPrimaryImage={onSetPrimaryImage}
                onUpdateSortOrder={(imageIndex, value) =>
                  onUpdateImage(imageIndex, "sortOrder", value)
                }
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
