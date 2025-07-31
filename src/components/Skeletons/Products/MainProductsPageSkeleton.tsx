import React from 'react'

const MainProductsPageSkeleton = () => {
    return (
        [...Array(4)].map((_, index) => (
            <div key={index + Math.floor(Math.random())} className="flex flex-col items-center justify-center dark:bg-neutral-800 bg-gray-100 rounded-b-3xl rounded-t-2xl w-full animate-pulse">
                {/* Image Swiper Skeleton */}
                <div className="w-full">
                    <div className="h-64 w-full bg-gray-200 dark:bg-neutral-700 rounded-t-2xl relative">
                        {/* Discount Badge Skeleton */}
                        <div className="absolute top-0 right-0 z-10">
                            <div className="h-6 w-16 bg-gray-300 dark:bg-neutral-600 rounded-tr-xl rounded-bl-xl"></div>
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-3xl border">
                    {/* Category and Rating */}
                    <div className="flex items-center justify-between pb-2">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    </div>

                    {/* Product Name */}
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded mb-3"></div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                            <div className="h-6 w-16 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))
    )
}

export default MainProductsPageSkeleton