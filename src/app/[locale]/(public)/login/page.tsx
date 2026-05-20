import SwitchLanguage from "@/component/SwitchLanguage";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import LoginForm from "./_components/LoginForm";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Login");
  const locale = await getLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return {
    title: t("title"),
    alternates: {
      canonical: siteUrl ? `${siteUrl}/${locale}/login` : `/${locale}/login`,
      languages: {
        vi: siteUrl ? `${siteUrl}/vi/login` : "/vi/login",
        en: siteUrl ? `${siteUrl}/en/login` : "/en/login",
      },
    },
  };
}

async function LoginPage() {
  const t = await getTranslations("Login");
  const locale = await getLocale();

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white relative">
      <div className="absolute right-2 top-2">
        <SwitchLanguage locale={locale} />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src="/logo3.png"
          alt="Your Company"
          className="mx-auto h-15 w-auto"
          width={300}
          height={300}
          sizes="(max-width: 640px) 80vw, 300px"
          priority
        />
        <h2 className="mt-7 text-center text-2xl/9 font-bold tracking-tight text-back">
          {t("title")}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
