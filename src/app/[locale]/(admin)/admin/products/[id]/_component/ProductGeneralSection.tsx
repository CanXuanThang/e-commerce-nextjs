"use client";

import Selector from "@/component/Selector";
import { Option } from "@/types/common";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { ProductFormState } from "./types";
import FormattedNumberInput from "@/component/FormattedNumberInput";

interface Props {
  form: ProductFormState;
  categoryOptions: Option[];
  isCreateDetailsMode: boolean;
  isSaving: boolean;
  onFieldChange: <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) => void;
  onReset: () => void;
  onSave: () => void;
}

export default function ProductGeneralSection({
  form,
  categoryOptions,
  isCreateDetailsMode,
  isSaving,
  onFieldChange,
  onReset,
  onSave,
}: Props) {
  const t = useTranslations("Admin");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-950">
              {t("productDetail.generalInfo")}
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {isCreateDetailsMode
                ? t("productDetail.modeCreate")
                : t("productDetail.modeUpdate")}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {t("productDetail.generalInfoHint")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600"
          >
            <ArrowPathIcon className="size-4" />
            {t("productDetail.reset")}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <CheckCircleIcon className="size-4" />
            {t("productDetail.saveChanges")}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium text-slate-700">
            {t("products.fields.name")}
          </span>
          <input
            value={form.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-700">
            {t("products.fields.category")}
          </span>
          <Selector
            handleChange={(option) =>
              onFieldChange("categoryId", Number(option.value))
            }
            label={t("products.selectCategory")}
            options={categoryOptions}
            value={
              categoryOptions.find(
                (option) => Number(option.value) === form.categoryId,
              ) ?? null
            }
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-700">
            {t("products.fields.discount")}
          </span>
          <FormattedNumberInput
            value={form.discount}
            onChange={(value) => onFieldChange("discount", value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
          />
        </label>

        <label className="space-y-2 text-sm md:col-span-2">
          <span className="font-medium text-slate-700">
            {t("products.fields.description")}
          </span>
          <textarea
            rows={5}
            value={form.description}
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-amber-400"
          />
        </label>
      </div>
    </div>
  );
}
