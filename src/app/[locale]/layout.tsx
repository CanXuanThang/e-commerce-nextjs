import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/component/Header";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ReactNode } from "react";

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
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="mx-auto max-w-4xl h-screen">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
