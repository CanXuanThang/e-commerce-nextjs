import { getProductById } from "@/data/product";
import ProductItem from "./_component/ProductItem";
import { Product as IProduct } from "@/types/product";
import { BaseResponse } from "@/types/common";
import { cache, Suspense } from "react";
import HotProduct from "./_component/HotProduct";
import Skeleton from "@/component/Skeleton";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { generateProductStructuredData } from "@/utils/structuredData";

const getProductCached = cache(getProductById);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const locale = await getLocale();
  const productResp: BaseResponse<IProduct> = await getProductCached(
    Number(id),
  );

  if (!productResp || !productResp.data) {
    notFound();
  }

  const product = productResp.data;
  const title = product.name || "Product";
  const description = product.description || "";
  const image = product.variants?.[0]?.images?.[0]?.imageUrl;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const path = `/${locale}/product/${id}`;
  const url = siteUrl ? `${siteUrl}${path}` : path;

  const languages: Record<string, string> = {
    vi: `${siteUrl ? siteUrl : ""}/vi/product/${id}`,
    en: `${siteUrl ? siteUrl : ""}/en/product/${id}`,
  };

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product: BaseResponse<IProduct> = await getProductCached(Number(id));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // Generate JSON-LD structured data
  const structuredData = generateProductStructuredData(
    {
      id: product.data.id,
      name: product.data.name,
      description: product.data.description,
      image: product.data.variants?.[0]?.images?.[0]?.imageUrl || "",
      price: product.data.variants?.[0]?.sizes?.[0]?.price || 0,
      inStock:
        product.data.variants?.[0]?.sizes?.some((s) => s.quantity > 0) || false,
    },
    siteUrl,
  );

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductItem data={product.data} />

      <Suspense
        fallback={<Skeleton count={4} className="grid grid-cols-4 gap-4" />}
      >
        <HotProduct />
      </Suspense>
    </section>
  );
}

export default Product;
