import { getCategoryById } from "@/data/category";
import { CategoryResponse } from "@/types/category";
import { BaseResponse } from "@/types/common";
import Categories from "./_component/Categories";
import ProductTemplate from "./_component/ProductTemplate";

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
