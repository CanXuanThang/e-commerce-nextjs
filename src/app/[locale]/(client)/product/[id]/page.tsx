import { getProductById } from "@/data/product";
import ProductItem from "./_component/ProductItem";
import { Product as IProduct } from "@/types/product";
import { BaseResponse } from "@/types/common";
import { cache, Suspense } from "react";
import HotProduct from "./_component/HotProduct";
import Skeleton from "@/component/Skeleton";

const getProductCached = cache(getProductById);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product: BaseResponse<IProduct> = await getProductCached(Number(id));

  return {
    title: product.data.name,
    description: product.data.description,
  };
}

async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product: BaseResponse<IProduct> = await getProductCached(Number(id));

  return (
    <section>
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
