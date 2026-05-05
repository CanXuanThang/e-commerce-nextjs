import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BannersPage from "./_component";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return {
    title: t("banners.title"),
  };
}

export default async function Page() {
  return <BannersPage />;
}
