import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "../../../app/globals.css";

const ProductHolderSkeleton = () => {
    return (
        <Swiper
            slidesPerView={3}
            pagination={{ clickable: true }}
            navigation={false}
            modules={[Pagination, Navigation]}
            loop={false}
        >
            {[...Array(6)].map((_, index) => (
                <SwiperSlide className="px-2 w-full" key={index}>
                    <div className="flex flex-col items-center justify-center cursor-pointer dark:bg-neutral-800 bg-gray-100 rounded-b-3xl rounded-t-2xl w-full animate-pulse">
                        {/* Image placeholder */}
                        <div className="w-full py-3 relative">
                            <div className="bg-gray-200 dark:bg-neutral-700 h-64 w-full rounded-t-2xl"></div>
                            <div className='absolute top-0 right-0 z-10'>
                                <div className='bg-gray-300 h-6 w-16 rounded-tr-xl rounded-bl-xl'></div>
                            </div>
                        </div>

                        {/* Content placeholder */}
                        <div className="p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-3xl border">
                            <div className="flex items-center justify-between pb-2">
                                <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-16 rounded"></div>
                                <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-10 rounded"></div>
                            </div>

                            <div className="bg-gray-200 dark:bg-neutral-700 h-6 w-full my-2 rounded"></div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="bg-gray-200 dark:bg-neutral-700 h-10 w-32 rounded-full"></div>
                                <div className="bg-gray-200 dark:bg-neutral-700 h-6 w-20 rounded"></div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default ProductHolderSkeleton