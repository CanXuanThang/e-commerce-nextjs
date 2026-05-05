"use client";

import { Product } from "@/types/product";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import { useState } from "react";

interface Props {
  data: Product;
}

function ProductItem({ data }: Props) {
  const [variantIndex, setVariantIndex] = useState(0);

  const imgs = data.variants[variantIndex].images;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 max-w-5xl mx-auto py-4 px-3 lg:px-0 md:grid-cols-2 md:gap-6 ">
        <LeftContainer images={imgs} name={data.name} />

        <div className="relative">
          <RightContainer
            id={data.id}
            name={data.name}
            variants={data.variants}
            index={variantIndex}
            handleChangeIndex={(idx) => setVariantIndex(idx)}
            discount={data.discount}
          />
        </div>
      </div>

      <div className="bg-gray-300">
        <div className="max-w-7xl mx-auto px-2 py-5 text-[14px] flex flex-col gap-1">
          <p>
            <strong>Chất liệu:</strong>
            <br />► Kết hợp 60% Polyester và 40% Viscose, mang lại bề mặt vải
            mềm mại, mát nhẹ và thoáng khí. Chất vải ít nhăn, giữ form tốt, bền
            màu và tạo cảm giác thoải mái khi mặc cả ngày.
          </p>
          <p>
            <strong>Kiểu dáng:</strong>
            <br />► Form{" "}
            <a
              // href="https://krik.vn/ao-phong-pc6379.html"
              target="_blank"
              rel="noreferrer noopener"
            >
              <strong>áo thun nam</strong>
            </a>{" "}
            gọn gàng, dễ mặc, phù hợp với nhiều dáng người. Độ co giãn vừa phải
            giúp vận động linh hoạt, thích hợp cho cả đi làm lẫn đi chơi.
          </p>
          <p>
            <strong>Chi tiết:</strong>
            <br />► Bề mặt vải dệt ô vuông nổi (waffle), tạo hiệu ứng 3D nhẹ,
            tăng điểm nhấn cho trang phục.
            <br />► Bo cổ, bo tay và bo gấu được dệt chắc chắn, giúp áo giữ form
            ổn định.
            <br />► Tổng thể thiết kế đơn giản nhưng tinh tế, dễ phối đồ, mang
            lại vẻ ngoài trẻ trung và hiện đại.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
