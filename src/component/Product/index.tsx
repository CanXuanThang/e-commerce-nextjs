"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import CartItem from "./CartItem";
import "swiper/css";
import "swiper/css/navigation";
import { Product } from "@/types/product";

interface Props {
  data: Product[];
  slideCount?: number;
}

function ListItem({ data, slideCount = 4 }: Props) {
  return (
    <div className="w-full px-5 md:px-12 pb-12">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={12}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        loop
        grabCursor
        breakpoints={{
          320: { slidesPerView: slideCount - 3 },
          640: { slidesPerView: slideCount - 2 },
          1024: { slidesPerView: slideCount - 1 },
          1280: { slidesPerView: slideCount },
        }}
      >
        {data.map((item: any) => (
          <SwiperSlide key={item.id}>
            <CartItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ListItem;
