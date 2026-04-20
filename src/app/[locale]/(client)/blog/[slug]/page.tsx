import { getAllBlogSlugs, getBlogBySlug } from "@/data/blog";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllBlogSlugs();
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

  if (!blog) return notFound();

  return (
    <section>
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
