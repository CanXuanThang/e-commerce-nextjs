"use client";

import { addCommas } from "@/utils";
import Image from "next/image";
import { EyeIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Link } from "@/i18n/navigation";
import { Product, ProductImage, Variant } from "@/types/product";
import { useState } from "react";

interface Props {
  item: Product;
}

function CartItem({ item }: Props) {
  const [index, setIndex] = useState(0);

  return (
    item &&
    item.variants.length > 0 && (
      <div className="flex flex-col gap-1.5">
        <div className="relative group h-fit">
          <Link href={`/product/${item.id}`}>
            <Image
              src={item.variants[index].images[0].imageUrl}
              alt="item"
              width={300}
              height={300}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
              className="group-hover:hidden w-full"
            />

            <Image
              src={
                item.variants[index].images[1]?.imageUrl ??
                item.variants[index].images[0]?.imageUrl
              }
              alt="item"
              width={300}
              height={300}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
              className="hidden group-hover:block w-full"
            />
          </Link>

          <div className="absolute hidden group-hover:flex bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.24)] gap-2.5 rounded-md bottom-[24px] left-1/2 -translate-x-1/2 px-1.5 py-0.5">
            <ShoppingCartIcon
              width={20}
              height={20}
              color="back"
              className="hover:opacity-90 cursor-pointer"
            />
            <Link href={`/product/${item.id}`}>
              <EyeIcon
                width={20}
                height={20}
                color="back"
                className="hover:opacity-90 cursor-pointer"
              />
            </Link>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {item.variants.map((variant: Variant, index: number) => (
            <Image
              className="hover:border-2 hover:border-gray-500 cursor-pointer border-2"
              src={variant.images[0].imageUrl}
              alt={`${item.name}-${index}`}
              width={36}
              height={36}
              sizes="36px"
              key={index}
              onClick={() => setIndex(index)}
            />
          ))}
        </div>

        <span className="text-sm">{item.name}</span>

        <span className="font-semibold text-sm">
          {addCommas(item.variants[index].sizes[0].price.toString())} VNĐ
        </span>
      </div>
    )
  );
}

export default CartItem;
