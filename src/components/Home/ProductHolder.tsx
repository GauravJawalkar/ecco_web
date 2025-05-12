"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import "swiper/css";
import "../../app/globals.css";
import { useRef } from "react";
import Loader from "../Loaders/Loader";
import Link from "next/link";


interface holderProps {
  _id: string,
  name: string,
  price: number,
  images: ["", "", ""],
}

const ProductHolder = ({ rank, data, loading }: { rank: number, data: any, loading: boolean }) => {
  const swiperRef: any = useRef(null);

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="my-10">
      <div className="grid grid-cols-[1fr_2fr] gap-10 h-64"
        dir={`${rank % 2 ? "ltr" : "rtl"}`}>
        <div className="border p-5 bg-red-100 rounded-3xl place-content-center text-center">1</div>

        <div className="h-auto max-w-[87ch] prod-holder relative ">

          {loading && <div className="flex items-center justify-center">
            <Loader title={"Fetching..."} />
          </div>}

          {/* Product Card */}
          <Swiper
            slidesPerView={3}
            pagination={{ clickable: true }}
            navigation={false}
            modules={[Pagination, Navigation]}
            loop={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >


            {
              data?.map(({ _id, name, price, images }: holderProps) => {
                return (
                  <SwiperSlide className="px-2 w-full " key={_id}>
                    <Link href={`/products/${slugify(name)}?id=${_id}`} className="content-center flex items-center justify-center flex-col cursor-pointer dark:bg-neutral-800 bg-gray-100 rounded-b-3xl rounded-t-2xl w-full">
                      <div className="w-full py-3">
                        <Image
                          src={images?.[2] || ""}
                          alt="prodImage"
                          width={"180"}
                          height={"180"}
                          className="object-contain h-64 w-full" />
                      </div>
                      <div dir={"ltr"} className="p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-3xl border">
                        <div className="text-start text-sm text-gray-500 flex items-center justify-between pb-2">
                          <h1>Plants</h1>
                          <h1>⭐ (4.5)</h1>
                        </div>
                        <h1 title={name} className="font-semibold capitalize text-start text-lg truncate">
                          {name}
                        </h1>
                        <div className="flex items-center justify-between pt-2">
                          <button className="py-2 px-4 border rounded-full text-sm flex items-center justify-center gap-3 dark:border-neutral-700 hover:bg-neutral-800"><ShoppingCart className="h-5 w-5" /> Add To Cart</button>
                          <h1 className="font-semibold text-lg uppercase ">
                            ₹ {price}
                          </h1>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })
            }

            {/* <SwiperSlide className="px-2 " key={Math.floor(Math.random() * 1000)}>
              <div className=" border dark:border-neutral-600 content-center flex items-center justify-center flex-col w-fit">
                <Image
                  src={'/happy.svg'}
                  alt="prodImage"
                  width={"180"}
                  height={"180"}
                  className="bg-white object-cover h-full w-full border-b animate-pulse"
                />
                <div className="text-center py-1">

                  <h1 className="font-semibold uppercase text-lg text-yellow-600 animate-pulse">
                    HAPPY SHOPPING
                  </h1>
                </div>
              </div>
            </SwiperSlide> */}

          </Swiper>

          {rank % 2 ? (
            <button
              onClick={() => swiperRef.current.slideNext()}
              className="absolute top-1/2 -right-5 z-10 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 transition-all ease-linear duration-200 py-5 px-2 text-neutral-800 rounded border border-gray-300 dark:bg-neutral-800 dark:text-gray-300 dark:border-gray-500"
            >
              <ChevronRight />
            </button>
          ) : (
            <button
              onClick={() => swiperRef.current.slideNext()}
              className="absolute top-1/2 left-5 z-10 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 transition-all ease-linear duration-200 py-5 px-2 text-neutral-800 rounded border border-gray-300 dark:bg-neutral-800 dark:text-gray-300 dark:border-gray-500"
            >
              <ChevronLeft />
            </button>
          )}
        </div>
      </div>
    </div >
  );
};

export default ProductHolder;
