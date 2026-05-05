import Header from "@/component/Header";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import Footer from "@/component/Footer";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
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
