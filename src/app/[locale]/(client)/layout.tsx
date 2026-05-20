import Header from "@/component/Header";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import Footer from "@/component/Footer";
import { Metadata } from "next";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: siteUrl ? `${siteUrl}/${locale}` : `/${locale}`,
      languages: {
        vi: siteUrl ? `${siteUrl}/vi` : "/vi",
        en: siteUrl ? `${siteUrl}/en` : "/en",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-[92px] pb-8 md:pt-[135px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
