"use client";
/* eslint-disable @next/next/no-img-element */

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { EditableProductVariant } from "./types";
import FormattedNumberInput from "@/component/FormattedNumberInput";

interface Props {
  variant: EditableProductVariant;
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (imageIndex: number) => void;
  onSetPrimaryImage: (imageIndex: number) => void;
  onUpdateSortOrder: (imageIndex: number, value: number) => void;
}

export default function VariantImagesEditor({
  variant,
  onAddImages,
  onRemoveImage,
  onSetPrimaryImage,
  onUpdateSortOrder,
}: Props) {
  const t = useTranslations("Admin");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-base font-semibold text-slate-900">
            {t("productDetail.images")}
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            {t("productDetail.imagesHint")}
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50">
          <PlusIcon className="size-4" />
          {t("productDetail.uploadImages")}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              onAddImages(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      {variant.images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          {t("productDetail.noImages")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {variant.images.map((image, imageIndex) => (
            <div
              key={`image-${image.id ?? imageIndex}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-square bg-slate-100">
                {image.previewUrl ? (
                  <img
                    src={image.previewUrl}
                    alt={`variant-image-${imageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    {t("common.noData")}
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <FormattedNumberInput
                  value={image.sortOrder}
                  onChange={(value) => onUpdateSortOrder(imageIndex, value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
                  placeholder={t("productDetail.sortOrder")}
                  min={1}
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onSetPrimaryImage(imageIndex)}
                    className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      image.isPrimary
                        ? "cursor-pointer bg-emerald-100 text-emerald-700"
                        : "cursor-pointer border border-slate-200 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {t("productDetail.primaryImage")}
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveImage(imageIndex)}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <TrashIcon className="size-4" />
                    {t("productDetail.removeImage")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
