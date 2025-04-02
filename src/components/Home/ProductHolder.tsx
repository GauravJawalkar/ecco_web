"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "../../app/globals.css";
import { useRef } from "react";


interface holderProps {
  _id: string,
  name: string,
  price: number,
  images: [string]
}

const ProductHolder = ({ rank, data }: { rank: number, data: any }) => {
  const swiperRef: any = useRef(null);

  return (
    <div className="my-10">
      <div
        className="grid grid-cols-[1fr_2fr] gap-10 h-64"
        dir={`${rank % 2 ? "ltr" : "rtl"}`}
      >
        <div className="border p-5 bg-red-100 ">1</div>

        <div className="h-auto max-w-[87ch] prod-holder relative">
          {/* Product Card */}
          <Swiper
            slidesPerView={4}
            pagination={{ clickable: true }}
            navigation={false}
            modules={[Pagination, Navigation]}
            loop={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {
              data.map(({ _id, name, price, images }: holderProps) => {
                return (
                  <SwiperSlide className="px-2" key={_id}>
                    <div className=" border dark:border-neutral-600 content-center flex items-center justify-center flex-col w-fit">
                      <Image
                        src={images[0]}
                        alt="prodImage"
                        width={"180"}
                        height={"180"}
                        className="bg-white object-cover h-auto w-auto border-b"
                      />
                      <div className="text-center py-1 mx-2">
                        <p title={name} className="font-normal capitalize text-md line-clamp-1">
                          {name}
                        </p>
                        <h1 className="font-semibold uppercase text-lg">
                          From ₹ {price}
                        </h1>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })
            }

            <SwiperSlide className="px-2" key={Math.floor(Math.random() * 1000)}>
              <div className=" border dark:border-neutral-600 content-center flex items-center justify-center flex-col w-fit">
                <Image
                  src={'/happy.svg'}
                  alt="prodImage"
                  width={"180"}
                  height={"180"}
                  className="bg-white object-cover h-52 w-auto border-b animate-pulse"
                />
                <div className="text-center py-1">

                  <h1 className="font-semibold uppercase text-lg text-yellow-600 animate-pulse">
                    HAPPY SHOPPING
                  </h1>
                </div>
              </div>
            </SwiperSlide>

          </Swiper>

          {rank % 2 ? (
            <button
              onClick={() => swiperRef.current.slideNext()}
              className="absolute top-1/2 -right-5 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 transition-all ease-linear duration-200 py-5 px-2 z-10 text-neutral-800 rounded border border-gray-300 dark:bg-neutral-800 dark:text-gray-300 dark:border-gray-500"
            >
              <ChevronRight />
            </button>
          ) : (
            <button
              onClick={() => swiperRef.current.slideNext()}
              className="absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 transition-all ease-linear duration-200 py-5 px-2 z-10 text-neutral-800 rounded border border-gray-300 dark:bg-neutral-800 dark:text-gray-300 dark:border-gray-500"
            >
              <ChevronLeft />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHolder;
