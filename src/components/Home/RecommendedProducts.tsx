"use client"

import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "../../app/globals.css";
import ApiClient from "@/interceptors/ApiClient";

const RecentlyViewedProducts = ({ products, tag }: { products: [string], tag: boolean }) => {

    async function getRecentProducts() {
        try {
            const response = await ApiClient.post('/api/recentProducts', { products });
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Failed to fetch the recent Products");
            return [];
        }
    }

    const mutation = useMutation({
        mutationFn: getRecentProducts,
        onError: (error) => {
            console.error('Failed to fetch : ', error);
        }
    })


    useEffect(() => {
        if (products?.length >= 1) {
            mutation.mutate();
        }
    }, [products]);
    const slugify = (prodName: string) => prodName.toLowerCase().replace(/\s+/g, '-');


    return (
        <div className="h-auto border dark:border-neutral-700 rounded-xl dark:bg-neutral-900 mt-4 sm:mt-6 overflow-hidden">
            <div className="p-3 sm:p-5">
                <Swiper
                    modules={[Pagination]}
                    pagination={{
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet !w-1.5 !h-1.5 sm:!w-2 sm:!h-2 !mx-1 !bg-gray-300 dark:!bg-neutral-600',
                        bulletActiveClass: '!bg-gray-800 dark:!bg-white'
                    }}
                    navigation={false}
                    breakpoints={{
                        320: { slidesPerView: 2.5, spaceBetween: 12 },
                        480: { slidesPerView: 3.5, spaceBetween: 16 },
                        768: { slidesPerView: 3.5, spaceBetween: 20 },
                        1024: { slidesPerView: 5, spaceBetween: 30 }
                    }}
                    loop={mutation?.data?.length > 5}>
                    {
                        mutation?.data?.length !== 0 && mutation?.data?.map(({ _id, images, name, price, discount }: { _id: string, images: [string], name: string, price: number, discount: number }) => {
                            return (
                                <SwiperSlide className="relative w-full border rounded-2xl sm:rounded-3xl dark:border-neutral-700 h-full flex flex-col" key={_id}>
                                    <Link href={`/products/${slugify(name)}?id=${_id}`} className="flex flex-col h-full touch-manipulation pb-8">
                                        <div className="w-full relative">
                                            <Image
                                                src={images?.[0] || ""}
                                                alt="recentViewImage"
                                                height={200} width={200}
                                                sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                loading="lazy"
                                                className="object-contain w-full h-32 sm:h-48 lg:h-64 p-2 dark:bg-neutral-800 rounded-t-2xl sm:rounded-t-3xl" />
                                        </div>
                                        <div className="px-2 sm:px-3 py-3 sm:py-4 border-t dark:border-t-neutral-700 rounded-b-2xl sm:rounded-b-3xl space-y-1 sm:space-y-2 bg-white dark:bg-neutral-900 absolute bottom-0 left-0 right-0">
                                            <h1 className="text-xs sm:text-base lg:text-lg font-normal text-center text-gray-700 dark:text-gray-300 capitalize line-clamp-1">{name}</h1>
                                            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-center capitalize line-clamp-1">
                                                ₹{(price - discount)?.toLocaleString()}
                                                <span className="ml-1 sm:ml-2 text-xs sm:text-sm lg:text-base font-normal text-gray-500 line-through">
                                                    {price?.toLocaleString()}
                                                </span>
                                            </h1>
                                        </div>
                                        {tag && <h1 className="absolute w-auto px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-white bg-green-600 top-0 right-0 rounded-tr-2xl sm:rounded-tr-3xl rounded-bl-xl line-clamp-1">
                                            Recent View
                                        </h1>}
                                    </Link>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default RecentlyViewedProducts