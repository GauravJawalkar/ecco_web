import React from 'react'

const SingleProductSkeleton = () => {
    return (
        <section className='py-10 animate-pulse'>
            <div className='grid grid-cols-1 lg:grid-cols-[0.5fr_3fr_3.5fr] w-full gap-5 lg:gap-0 lg:space-x-4'>

                {/* Images Tray Skeleton */}
                <div className="order-2 lg:order-1 flex lg:block overflow-x-auto lg:overflow-visible gap-3 lg:gap-0 px-5 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className='lg:sticky w-max lg:w-full top-24 flex lg:block gap-3 lg:gap-0'>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className='flex items-center justify-center flex-shrink-0'>
                                <div className='w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-24 bg-gray-300 dark:bg-neutral-700 rounded-xl lg:mb-5'></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Image Skeleton */}
                <div className="order-1 lg:order-2 px-5 lg:px-0">
                    <div className='lg:sticky w-full overflow-hidden no-scrollbar top-24'>
                        <div className='w-full h-64 sm:h-80 lg:h-[500px] bg-gray-300 dark:bg-neutral-700 rounded-xl'></div>
                    </div>
                </div>

                {/* Product Information Skeleton */}
                <div className='order-3 flex flex-col items-start justify-start gap-4 sm:gap-5 px-5 lg:px-0'>
                    {/* Title */}
                    <div className='w-3/4 h-8 sm:h-10 lg:h-12 bg-gray-300 dark:bg-neutral-700 rounded'></div>

                    {/* Description */}
                    <div className='w-full space-y-2 lg:space-y-3'>
                        <div className='w-full h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                        <div className='w-4/5 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                        <div className='w-1/4 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                    </div>

                    {/* Rating Stars */}
                    <div className='flex gap-1.5 sm:gap-2 items-center'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className='w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 dark:bg-neutral-700 rounded-full'></div>
                        ))}
                        <div className='w-10 sm:w-12 h-4 sm:h-5 bg-gray-300 dark:bg-neutral-700 rounded-full ml-1 sm:ml-2'></div>
                    </div>

                    {/* Price Section */}
                    <div className='p-3 sm:p-4 bg-gray-200 dark:bg-neutral-800 rounded-lg w-full space-y-1.5 sm:space-y-2'>
                        <div className='flex items-end gap-2 sm:gap-3'>
                            <div className='w-20 sm:w-24 h-6 sm:h-8 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                            <div className='w-16 sm:w-20 h-4 sm:h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-0.5'></div>
                            <div className='w-14 sm:w-16 h-4 sm:h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-0.5'></div>
                        </div>
                        <div className='w-24 sm:w-32 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                    </div>

                    {/* Highlights Section */}
                    <div className='w-full border rounded-xl dark:border-neutral-700 overflow-hidden'>
                        <div className='p-4 sm:p-5 border-b dark:border-neutral-700'>
                            <div className='w-24 h-5 sm:h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-2 sm:mb-3'></div>
                            <div className='space-y-2 sm:space-y-3'>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className='flex items-center'>
                                        <div className='w-4 h-4 sm:w-5 sm:h-5 bg-gray-300 dark:bg-neutral-700 rounded-full mr-2'></div>
                                        <div className='w-32 sm:w-40 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className='p-4 sm:p-5 border-b dark:border-neutral-700'>
                            <div className='w-32 h-5 sm:h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-2 sm:mb-3'></div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className='h-10 sm:h-12 bg-gray-200 dark:bg-neutral-700/50 rounded-lg'></div>
                                ))}
                            </div>
                        </div>

                        {/* Seller Information */}
                        <div className='p-4 sm:p-5'>
                            <div className='w-36 h-5 sm:h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-2 sm:mb-3'></div>
                            <div className='flex items-start'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 dark:bg-neutral-700 rounded-full mr-3 sm:mr-4 flex-shrink-0'></div>
                                <div className='flex-1 space-y-1.5 sm:space-y-2'>
                                    <div className='w-24 sm:w-32 h-4 sm:h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-32 sm:w-40 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-40 sm:w-48 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add to cart buttons */}
                    <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-4 mt-2 sm:mt-0">
                        <div className='w-full h-11 sm:h-12 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                        <div className='w-full h-11 sm:h-12 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                    </div>

                    {/* Ratings and reviews section */}
                    <div className='w-full p-3 sm:p-4 my-1 sm:my-2 border dark:border-neutral-700 rounded-xl space-y-3 sm:space-y-4'>
                        <div className='w-40 sm:w-48 h-5 sm:h-6 bg-gray-300 dark:bg-neutral-700 rounded'></div>

                        {/* Ratings summary */}
                        <div className='py-3 sm:py-4 space-y-2'>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5'>
                                <div className='w-16 h-5 sm:h-6 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                <div className='w-40 sm:w-48 h-4 sm:h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                            </div>
                        </div>

                        {/* Review items */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className='p-3 sm:p-4 border dark:border-neutral-700 rounded-xl space-y-2.5 sm:space-y-3'>
                                <div className='space-y-1.5 sm:space-y-2'>
                                    <div className='w-24 sm:w-32 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-full h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='flex gap-2'>
                                        {[...Array(3)].map((_, imgIndex) => (
                                            <div key={imgIndex} className='w-12 h-12 sm:w-14 sm:h-14 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex space-x-4 pt-1'>
                                    <div className='w-8 sm:w-10 h-4 sm:h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-8 sm:w-10 h-4 sm:h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                </div>
                            </div>
                        ))}

                        {/* Buttons */}
                        <div className='py-3 gap-2 flex items-start justify-start flex-wrap'>
                            <div className='w-20 sm:w-24 h-10 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                            <div className='w-24 sm:w-28 h-10 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Viewed Section Skeleton */}
            <div className='pb-5 px-4 lg:px-0 mt-8 sm:mt-10'>
                <div className='relative'>
                    <div className='w-24 sm:w-32 lg:w-48 h-4 sm:h-5 lg:h-6 bg-gray-300 dark:bg-neutral-700 rounded absolute top-0 right-0 z-10'></div>
                    <div className='flex overflow-hidden gap-3 sm:gap-4 pt-6 sm:pt-8'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className='border dark:border-neutral-700 rounded-2xl sm:rounded-3xl p-3 sm:p-4 space-y-2 sm:space-y-3 flex-shrink-0 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%]'>
                                <div className='w-full h-32 sm:h-48 lg:h-64 bg-gray-300 dark:bg-neutral-700 rounded-xl sm:rounded-2xl'></div>
                                <div className='w-full h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                <div className='w-2/3 h-3 sm:h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SingleProductSkeleton