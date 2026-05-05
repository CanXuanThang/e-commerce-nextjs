import Blog from "@/component/Blogs";
import ListItem from "@/component/Product";
import getBanner from "@/data/banner";
import { getBlogByLocale } from "@/data/blog";
import { getProducts } from "@/data/product";
import { Banner } from "@/types/banner";
import { BaseResponse } from "@/types/common";
import { Product } from "@/types/product";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("Home");
  const { locale } = await params;
  const banners: BaseResponse<Banner[]> = await getBanner();
  const listBlog = getBlogByLocale(locale);
  const products: BaseResponse<Product[]> = await getProducts();

  return (
    <section className="flex flex-col gap-1">
      <video autoPlay muted loop playsInline className="h-full">
        <source src="/video-info.mp4" type="video/mp4" />
      </video>

      <h2 className="text-2xl uppercase text-center my-4 font-semibold text-gray-500">
        {t("hotProduct")}
      </h2>

      <ListItem data={products.data} />

      <Image
        src={
          banners.data && banners.data.length > 0
            ? banners.data[0].imageUrl
            : ""
        }
        width={1200}
        height={400}
        quality={100}
        alt="banner"
        className="w-full"
      />

      <h2 className="text-2xl uppercase text-center my-4 font-semibold text-gray-500">
        {t("trending")}
      </h2>

      <Blog listBlog={listBlog} />
    </section>
  );
}
