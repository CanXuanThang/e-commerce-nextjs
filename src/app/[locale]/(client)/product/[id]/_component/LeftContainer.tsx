"use client";

import { ProductImage } from "@/types/product";
import Image from "next/image";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface Props {
  images: ProductImage[];
  name: string;
}

function LeftContainer({ images, name }: Props) {
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <div className="grid grid-cols-[15%_1fr] gap-3">
      <div className="flex gap-1.5 flex-col">
        {images.map((img, index) => (
          <Image
            key={img.id}
            src={img.imageUrl}
            alt={`${name}-${index}`}
            width={300}
            height={300}
            className="cursor-pointer"
            onClick={() => setCurrentImg(index)}
          />
        ))}
      </div>

      <Zoom>
        <Image
          src={images[currentImg].imageUrl}
          width={300}
          height={300}
          alt={`${name}`}
          className="w-full"
        />
      </Zoom>
    </div>
  );
}

export default LeftContainer;
