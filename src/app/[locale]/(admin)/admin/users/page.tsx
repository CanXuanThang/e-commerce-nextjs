import { getAdminUsers } from "@/utils/adminServer";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import UsersPage from "./_component";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return {
    title: t("users.title"),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const initialUsers = await getAdminUsers(locale);

  return <UsersPage initialUsers={initialUsers} />;
}
