"use client"

import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "../../app/globals.css";

const RecentlyViewedProducts = ({ products, tag }: { products: [string], tag: boolean }) => {

    async function getRecentProducts() {
        try {
            const response = await axios.post('/api/recentProducts', { products });
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
        mutation.mutate();
    }, [products]);
    const slugify = (prodName: string) => prodName.toLowerCase().replace(/\s+/g, '-');


    return (
        <div className="h-auto border dark:border-neutral-700 rounded-xl dark:bg-neutral-900">
            <div className="p-5">
                <Swiper
                    slidesPerView={5}
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    navigation={false}
                    modules={[Pagination, Navigation]}
                    loop={true}>
                    {
                        mutation?.data?.length !== 0 && mutation?.data?.map(({ _id, images, name, price, discount }: { _id: string, images: [string], name: string, price: number, discount: number }) => {
                            return (
                                <SwiperSlide className="relative w-full border rounded-3xl dark:border-neutral-700 " key={_id}>
                                    <Link href={`/products/${slugify(name)}?id=${_id}`}>
                                        <Image
                                            src={images?.[0] || ""}
                                            alt="recentViewImage"
                                            height={200} width={200}
                                            className="object-contain w-full h-64 p-2 dark:bg-neutral-800 rounded-t-3xl" />
                                        <div className="px-2 py-4 border-t dark:border-t-neutral-700 rounded-b-3xl space-y-2">
                                            <h1 className="text-lg font-normal text-center text-gray-700 dark:text-gray-300 capitalize line-clamp-1">{name}</h1>
                                            <h1 className="text-lg font-semibold text-center capitalize line-clamp-1 ">
                                                ₹{price - discount}
                                                <span className="px-2 text-base font-normal text-gray-500 line-through">
                                                    {price}
                                                </span>
                                            </h1>
                                        </div>
                                        {tag && <h1 className="absolute w-auto px-2 text-white bg-green-600 top-0 right-0 rounded-tr-xl rounded-bl-xl line-clamp-1">
                                            Recent View
                                        </h1>}
                                    </Link>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>

        </div >
    )
}

export default RecentlyViewedProducts