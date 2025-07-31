import React from 'react'

const SingleProductSkeleton = () => {
    return (
        <section className='animate-pulse'>
            <div className='grid grid-cols-[0.5fr_3fr_3.5fr] w-full space-x-4'>
                {/* Images Tray Skeleton */}
                <div>
                    <div className='sticky w-full top-24 space-y-5'>
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className='flex items-center justify-center'>
                                <div className='w-full h-20 bg-gray-200 dark:bg-neutral-700 rounded-xl'></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Image Skeleton */}
                <div>
                    <div className='sticky w-full top-24'>
                        <div className='w-full h-[500px] bg-gray-200 dark:bg-neutral-700 rounded-xl'></div>
                    </div>
                </div>

                {/* Product Information Skeleton */}
                <div className='flex flex-col items-start justify-start gap-5 px-5'>
                    {/* Product Name */}
                    <div className='w-full space-y-3'>
                        <div className='h-10 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                        <div className='h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded'></div>
                        <div className='h-4 w-2/3 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                        <div className='h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                    </div>

                    {/* Rating Stars */}
                    <div className='flex gap-2'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className='w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded-full'></div>
                        ))}
                        <div className='h-5 w-10 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                    </div>

                    {/* Price Section */}
                    <div className='w-full space-y-2'>
                        <div className='h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                        <div className='flex gap-4'>
                            <div className='h-8 w-24 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                            <div className='h-8 w-20 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                            <div className='h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                        </div>
                    </div>

                    {/* Highlights Box */}
                    <div className='w-full p-4 border rounded-lg dark:border-neutral-700 space-y-4'>
                        {[...Array(3)].map((_, sectionIndex) => (
                            <div key={sectionIndex} className='grid grid-cols-[0.7fr_2fr] gap-4 py-4 border-b dark:border-neutral-700'>
                                <div className='h-5 w-full bg-gray-200 dark:bg-neutral-700 rounded'></div>
                                <div className='space-y-2'>
                                    {[...Array(4)].map((_, itemIndex) => (
                                        <div key={itemIndex} className='h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded'></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center justify-between w-full gap-4'>
                        <div className='h-12 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg'></div>
                        <div className='h-12 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg'></div>
                    </div>

                    {/* Ratings and Reviews Section */}
                    <div className='w-full p-4 my-2 border dark:border-neutral-700 rounded-xl space-y-4'>
                        <div className='h-6 w-48 bg-gray-200 dark:bg-neutral-700 rounded'></div>

                        {/* Rating Summary */}
                        <div className='flex gap-4 items-center py-4'>
                            <div className='h-8 w-16 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                            <div className='h-5 w-48 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                        </div>

                        {/* Review Items */}
                        {[...Array(2)].map((_, reviewIndex) => (
                            <div key={reviewIndex} className='p-4 my-2 space-y-3 border dark:border-neutral-700 rounded-xl'>
                                <div className='space-y-2'>
                                    <div className='h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                                    <div className='h-5 w-full bg-gray-200 dark:bg-neutral-700 rounded'></div>
                                    <div className='flex gap-2'>
                                        {[...Array(3)].map((_, imgIndex) => (
                                            <div key={imgIndex} className='h-14 w-14 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex space-x-4'>
                                    <div className='h-5 w-16 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                                    <div className='h-5 w-16 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                                </div>
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className='flex gap-2 py-3'>
                            <div className='h-10 w-24 bg-gray-200 dark:bg-neutral-700 rounded-lg'></div>
                            <div className='h-10 w-24 bg-gray-200 dark:bg-neutral-700 rounded-lg'></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SingleProductSkeleton