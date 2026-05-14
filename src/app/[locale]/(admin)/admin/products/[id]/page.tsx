import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductDetail from "./_component";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return {
    title: t("productDetail.title"),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("Admin");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/admin" },
          { label: t("products.title"), href: "/admin/products" },
          { label: t("productDetail.title") },
        ]}
        title={t("productDetail.title")}
      />

      <ProductDetail productId={Number(id)} />
    </div>
  );
}
