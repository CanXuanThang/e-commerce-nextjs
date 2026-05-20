import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import Container from "@/providers";
import Loading from "@/component/Loading";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    viewport: "width=device-width, initial-scale=1",
    robots: { index: true, follow: true },
    alternates: {
      canonical: siteUrl ? siteUrl : undefined,
      languages: {
        vi: siteUrl ? `${siteUrl}/vi` : "/vi",
        en: siteUrl ? `${siteUrl}/en` : "/en",
      },
    },
    openGraph: {
      siteName: "E-Commerce",
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <Container>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster position="top-center" richColors />
            <Loading />
          </NextIntlClientProvider>
        </Container>
      </body>
    </html>
  );
}
