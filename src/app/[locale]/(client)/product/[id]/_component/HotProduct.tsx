import ListItem from "@/component/Product";
import { getProductByBestReview } from "@/data/product";
import { BaseResponse } from "@/types/common";
import { Product } from "@/types/product";
import { getTranslations } from "next-intl/server";

export default async function HotProduct() {
  const t = await getTranslations("Product");
  const bestProducts: BaseResponse<Product[]> = await getProductByBestReview();

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex flex-col py-6">
        <span className="font-semibold border-b-2 w-fit pb-2 text-xl">
          {t("hot")}
        </span>

        <hr />
      </div>

      {bestProducts.data && <ListItem data={bestProducts.data} />}
    </div>
  );
}
