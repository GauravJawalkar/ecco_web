import React from 'react'

const SingleProductSkeleton = () => {
    return (
        <section className='py-10 animate-pulse'>
            <div className='grid grid-cols-[0.5fr_3fr_3.5fr] w-full space-x-4'>

                {/* Images Tray Skeleton */}
                <div>
                    <div className='sticky w-full top-24 space-y-5'>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className='flex items-center justify-center'>
                                <div className='w-full h-24 bg-gray-300 dark:bg-neutral-700 rounded-xl'></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Image Skeleton */}
                <div>
                    <div className='sticky w-full top-24'>
                        <div className='w-full h-[500px] bg-gray-300 dark:bg-neutral-700 rounded-xl'></div>
                    </div>
                </div>

                {/* Product Information Skeleton */}
                <div className='flex flex-col items-start justify-start gap-5 px-5'>
                    {/* Title */}
                    <div className='w-3/4 h-8 bg-gray-300 dark:bg-neutral-700 rounded'></div>

                    {/* Description */}
                    <div className='w-full space-y-2'>
                        <div className='w-full h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                        <div className='w-4/5 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                        <div className='w-1/4 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                    </div>

                    {/* Rating Stars */}
                    <div className='flex gap-2'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className='w-5 h-5 bg-gray-300 dark:bg-neutral-700 rounded-full'></div>
                        ))}
                        <div className='w-12 h-5 bg-gray-300 dark:bg-neutral-700 rounded-full ml-2'></div>
                    </div>

                    {/* Price Section */}
                    <div className='p-4 bg-gray-200 dark:bg-neutral-800 rounded-lg w-full space-y-2'>
                        <div className='flex items-end gap-3'>
                            <div className='w-24 h-8 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                            <div className='w-20 h-6 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                            <div className='w-16 h-6 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                        </div>
                        <div className='w-32 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                    </div>

                    {/* Highlights Section */}
                    <div className='w-full border rounded-xl dark:border-neutral-700 overflow-hidden'>
                        <div className='p-5 border-b dark:border-neutral-700'>
                            <div className='w-24 h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-3'></div>
                            <div className='space-y-3'>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className='flex items-center'>
                                        <div className='w-5 h-5 bg-gray-300 dark:bg-neutral-700 rounded-full mr-2'></div>
                                        <div className='w-40 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className='p-5 border-b dark:border-neutral-700'>
                            <div className='w-32 h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-3'></div>
                            <div className='grid grid-cols-2 gap-3'>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className='h-12 bg-gray-200 dark:bg-neutral-700/50 rounded-lg'></div>
                                ))}
                            </div>
                        </div>

                        {/* Seller Information */}
                        <div className='p-5'>
                            <div className='w-36 h-6 bg-gray-300 dark:bg-neutral-700 rounded mb-3'></div>
                            <div className='flex items-start'>
                                <div className='w-12 h-12 bg-gray-300 dark:bg-neutral-700 rounded-full mr-4'></div>
                                <div className='flex-1 space-y-2'>
                                    <div className='w-32 h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-40 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-48 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add to cart buttons */}
                    <div className="flex items-center justify-between w-full gap-4">
                        <div className='w-full h-12 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                        <div className='w-full h-12 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                    </div>

                    {/* Ratings and reviews section */}
                    <div className='w-full p-4 my-2 border dark:border-neutral-700 rounded-xl space-y-4'>
                        <div className='w-48 h-6 bg-gray-300 dark:bg-neutral-700 rounded'></div>

                        {/* Ratings summary */}
                        <div className='py-4 space-y-2'>
                            <div className='flex items-center space-x-5'>
                                <div className='w-16 h-6 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                <div className='w-48 h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                            </div>
                        </div>

                        {/* Review items */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className='p-4 border dark:border-neutral-700 rounded-xl space-y-3'>
                                <div className='space-y-2'>
                                    <div className='w-32 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-full h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='flex gap-2'>
                                        {[...Array(3)].map((_, imgIndex) => (
                                            <div key={imgIndex} className='w-14 h-14 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex space-x-4'>
                                    <div className='w-10 h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                    <div className='w-10 h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                </div>
                            </div>
                        ))}

                        {/* Buttons */}
                        <div className='py-3 gap-2 flex items-start justify-start'>
                            <div className='w-24 h-10 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                            <div className='w-28 h-10 bg-gray-300 dark:bg-neutral-700 rounded-xl'></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Viewed Section Skeleton */}
            <div className='pb-5 mt-10'>
                <div className='relative'>
                    <div className='w-48 h-6 bg-gray-300 dark:bg-neutral-700 rounded absolute top-0 right-0 z-10'></div>
                    <div className='grid grid-cols-4 gap-4 pt-8'>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className='border dark:border-neutral-700 rounded-xl p-4 space-y-3'>
                                <div className='w-full h-40 bg-gray-300 dark:bg-neutral-700 rounded-xl'></div>
                                <div className='w-3/4 h-5 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                <div className='w-1/2 h-4 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                <div className='w-2/3 h-6 bg-gray-300 dark:bg-neutral-700 rounded'></div>
                                <div className='w-full h-10 bg-gray-300 dark:bg-neutral-700 rounded-lg'></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SingleProductSkeleton