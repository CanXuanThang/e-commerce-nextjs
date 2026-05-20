"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";

interface Props {
  listBlog: Blog[];
}

interface Blog {
  slug: string;
  locale: string;
  title: string;
  date: string;
  img: string;
  thumbnail: string;
  shortContent: string;
  content: string;
}

function Blog({ listBlog }: Props) {
  return (
    <div className="w-full px-5 pb-12">
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
        {listBlog.map((blog) => (
          <SwiperSlide key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              <div className="overflow-hidden">
                <Image
                  width={120}
                  height={80}
                  quality={100}
                  src={blog.img}
                  alt={blog.title}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="w-full h-[210px] transition-transform duration-500 hover:scale-110 cursor-pointer"
                />
              </div>
              <h3 className="text-xs font-semibold hover:text-red-400 cursor-pointer mt-2 h-8">
                {blog.title}
              </h3>
            </Link>
            <span className="text-xs text-gray-500">{blog.date}</span>
            <hr className="border-gray-400 my-2" />
            <div
              className="line-clamp-3 text-xs text-gray-500 mt-1"
              dangerouslySetInnerHTML={{
                __html: blog.shortContent,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Blog;
