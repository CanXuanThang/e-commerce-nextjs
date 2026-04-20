import { getProductbyId } from "@/data/product";
import ProductItem from "./_component/ProductItem";
import { Product as IProduct } from "@/models/product";
import { BaseResponse } from "@/models/common";
import { cache } from "react";

const getProductCached = cache(getProductbyId);

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
    </section>
  );
}

export default Product;
