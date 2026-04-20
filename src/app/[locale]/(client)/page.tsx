import ListItem from "@/component/Product";
import getBanner from "@/data/banner";
import { getBlogByLocale } from "@/data/blog";
import { getProducts } from "@/data/product";
import { Link } from "@/i18n/navigation";
import { Banner } from "@/models/banner";
import { BaseResponse } from "@/models/common";
import { Product } from "@/models/product";
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

      <div className="grid grid-cols-4 gap-3 px-6 mb-6">
        {listBlog.map((blog) => (
          <div key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              <div className="overflow-hidden">
                <Image
                  width={120}
                  height={80}
                  quality={100}
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-[210px] transition-transform duration-500 hover:scale-110 cursor-pointer"
                />
              </div>
              <h3 className="text-xs font-semibold hover:text-red-400 cursor-pointer mt-2 h-8">
                {blog.title}
              </h3>
            </Link>
            <span className="text-xs text-gray-500">{blog.date}</span>
            <hr className="border-gray-400 my-2" />
            <div
              className="line-clamp-3 text-xs text-gray-500 mt-1"
              dangerouslySetInnerHTML={{
                __html: blog.shortContent,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
