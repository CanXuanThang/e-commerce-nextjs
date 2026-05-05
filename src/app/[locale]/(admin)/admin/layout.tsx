import AdminShell from "@/component/Admin/AdminShell";
import { AdminLocale } from "@/types/admin";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return {
    title: t("title"),
    description: t("title"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = (await getLocale()) as AdminLocale;

  return <AdminShell locale={locale}>{children}</AdminShell>;
}
