"use client";

import { Option } from "@/types/common";
import { addCommas } from "@/utils";
import { formatAdminCurrency } from "@/utils";
import { useLocale, useTranslations } from "next-intl";
import { ProductFormState } from "./types";

interface Props {
  categoryOptions: Option[];
  form: ProductFormState;
}

export default function ProductSummaryCards({ categoryOptions, form }: Props) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  const totalStock = form.variants.reduce(
    (total, variant) =>
      total +
      variant.sizes.reduce(
        (sizeTotal, size) => sizeTotal + Number(size.quantity || 0),
        0,
      ),
    0,
  );

  const samplePrice =
    form.variants
      .flatMap((variant) => variant.sizes)
      .find((size) => Number(size.price) > 0)?.price ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {t("products.fields.category")}
        </p>
        <p className="mt-3 text-lg font-semibold text-slate-900">
          {categoryOptions.find(
            (option) => Number(option.value) === form.categoryId,
          )?.label ?? t("common.noData")}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {t("products.fields.stock")}
        </p>
        <p className="mt-3 text-lg font-semibold text-slate-900">
          {addCommas(String(totalStock))}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {t("products.fields.price")}
        </p>
        <p className="mt-3 text-lg font-semibold text-amber-600">
          {formatAdminCurrency(samplePrice, locale)}
        </p>
      </div>
    </div>
  );
}
