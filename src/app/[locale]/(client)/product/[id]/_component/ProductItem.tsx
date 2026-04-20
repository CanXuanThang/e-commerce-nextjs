"use client";

import { Product } from "@/models/product";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import { useState } from "react";

interface Props {
  data: Product;
}

function ProductItem({ data }: Props) {
  const [variantIndex, setVariantIndex] = useState(0);

  const imgs = data.variants[variantIndex].images;

  console.log(data);

  return (
    <div className="grid grid-cols-1 gap-3 max-w-5xl mx-auto py-4 px-3 lg:px-0 md:grid-cols-2 md:gap-6 ">
      <LeftContainer images={imgs} name={data.name} />

      <div className="relative">
        <RightContainer
          name={data.name}
          variants={data.variants}
          index={variantIndex}
          handleChangeIndex={(idx) => setVariantIndex(idx)}
          discount={20}
        />
      </div>
    </div>
  );
}

export default ProductItem;
