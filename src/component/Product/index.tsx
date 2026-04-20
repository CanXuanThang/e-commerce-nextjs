"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import CartItem from "./CartItem";
import "swiper/css";
import "swiper/css/navigation";
import { Product } from "@/models/product";

interface Props {
  data: Product[];
}

function ListItem({ data }: Props) {
  return (
    <div className="w-full px-12 pb-12">
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
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
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
