import { getAllBlogSlugs, getBlogBySlug } from "@/data/blog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateArticleStructuredData } from "@/utils/structuredData";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllBlogSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const blog = getBlogBySlug(slug, locale);

  if (!blog) {
    return { title: "Blog not found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const blogUrl = siteUrl
    ? `${siteUrl}/${locale}/blog/${slug}`
    : `/${locale}/blog/${slug}`;

  // Extract summary from content (first 160 chars)
  const plainText = blog.content.replace(/<[^>]*>/g, "").substring(0, 160);

  return {
    title: blog.title,
    description: plainText || blog.title,
    alternates: {
      canonical: blogUrl,
      languages: {
        vi: siteUrl ? `${siteUrl}/vi/blog/${slug}` : `/vi/blog/${slug}`,
        en: siteUrl ? `${siteUrl}/en/blog/${slug}` : `/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: blog.title,
      description: plainText,
      url: blogUrl,
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}) {
  const { locale, slug } = await params;
  const blog = getBlogBySlug(slug, locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  if (!blog) return notFound();

  // Extract summary from content (first 160 chars)
  const plainText = blog.content.replace(/<[^>]*>/g, "").substring(0, 160);

  // Generate JSON-LD structured data
  const structuredData = generateArticleStructuredData(
    {
      title: blog.title,
      description: plainText,
      image: `${siteUrl}/logo3.png`, // Use default logo since blog doesn't have image
      datePublished: new Date().toISOString(),
    },
    siteUrl,
  );

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="max-w-5xl mx-auto py-5 px-2 lg:px-0">
        <h1 className="text-3xl font-bold mb-4 ">{blog.title}</h1>

        <div
          className="prose flex flex-col gap-1"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </article>
    </section>
  );
}
