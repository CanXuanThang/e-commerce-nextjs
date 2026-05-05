"use client";

import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { FormOrderValue } from ".";
import Selector from "@/component/Selector";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export default function AddressSelector() {
  const t = useTranslations("Order");
  const form = useFormContext<FormOrderValue>();

  const { data: provinces = [] } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await fetch("https://provinces.open-api.vn/api/v1");
      return res.json();
    },
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["districts", form.watch("province")?.value],
    queryFn: async () => {
      const res = await fetch(
        `https://provinces.open-api.vn/api/v1/p/${form.watch("province")?.value}?depth=2`,
      );
      return res.json();
    },
    enabled: !!form.watch("province")?.value,
  });

  const { data: wards = [] } = useQuery({
    queryKey: ["wards", form.watch("district")?.value],
    queryFn: async () => {
      const res = await fetch(
        `https://provinces.open-api.vn/api/v1/d/${form.watch("district")?.value}?depth=2`,
      );
      return res.json();
    },
    enabled: !!form.watch("district")?.value,
  });

  const optionsProvince = useMemo(() => {
    if (!provinces) return [];
    return provinces.map((p: any) => ({
      value: p.code,
      label: p.name,
    }));
  }, [provinces]);

  const optionsDistrict = useMemo(() => {
    if (!districts || !districts.districts) return [];
    return districts.districts?.map((d: any) => ({
      value: d.code,
      label: d.name,
    }));
  }, [districts]);

  const optionsWard = useMemo(() => {
    if (!wards || !wards.wards) return [];
    return wards.wards?.map((w: any) => ({
      value: w.code,
      label: w.name,
    }));
  }, [wards]);

  return (
    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="flex flex-col gap-0.5">
        <Selector
          handleChange={(option) => {
            form.setValue("province", option);
            form.setValue("district", { value: "", label: t("district") });
            form.setValue("ward", { value: "", label: t("ward") });
          }}
          label={t("province")}
          options={optionsProvince}
          value={form.watch("province")}
        />

        {form.formState.errors.province?.label && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.province.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Selector
          handleChange={(option) => form.setValue("district", option)}
          label={t("district")}
          options={optionsDistrict}
          value={form.watch("district")}
        />

        {form.formState.errors.district?.label && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.district.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Selector
          handleChange={(option) => form.setValue("ward", option)}
          label={t("ward")}
          options={optionsWard}
          value={form.watch("ward")}
        />

        {form.formState.errors.ward?.label && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.ward.message}
          </p>
        )}
      </div>
    </div>
  );
}
