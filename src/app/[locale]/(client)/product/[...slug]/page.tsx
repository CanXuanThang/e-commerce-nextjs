import { getCategoryById } from "@/data/category";
import { CategoryResponse } from "@/types/category";
import { BaseResponse } from "@/types/common";
import Categories from "./_component/Categories";
import ProductTemplate from "./_component/ProductTemplate";
import { Metadata } from "next";

async function getMetadataForCategory(categoryId: number) {
  try {
    const categories: BaseResponse<CategoryResponse> =
      await getCategoryById(categoryId);
    return categories.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const id = slug.at(-1) ? Number(slug.at(-1)) : 1;

  const category = await getMetadataForCategory(id);
  const categoryName = category?.name || "Products";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const path = `/${locale}/product/${slug.join("/")}`;
  const url = siteUrl ? `${siteUrl}${path}` : path;

  return {
    title: categoryName,
    description: `Browse our ${categoryName} collection`,
    alternates: {
      canonical: url,
      languages: {
        vi: siteUrl
          ? `${siteUrl}/vi/product/${slug.join("/")}`
          : `/vi/product/${slug.join("/")}`,
        en: siteUrl
          ? `${siteUrl}/en/product/${slug.join("/")}`
          : `/en/product/${slug.join("/")}`,
      },
    },
    openGraph: {
      title: categoryName,
      description: `Browse our ${categoryName} collection`,
      url,
    },
  };
}

async function ProductByCategory({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const id = slug.at(-1) ? Number(slug.at(-1)) : 1;

  const categories: BaseResponse<CategoryResponse> = await getCategoryById(id);

  return (
    <section className="mt-4 flex flex-col gap-4">
      <Categories categories={categories.data.children} />

      <ProductTemplate id={id} />
    </section>
  );
}

export default ProductByCategory;
