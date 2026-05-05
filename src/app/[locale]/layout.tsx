import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import Container from "@/providers";
import Loading from "@/component/Loading";

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
