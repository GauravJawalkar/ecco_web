import React from 'react'

const DashboardStoreHeroSkeleton = () => {
    return (
        <section className="relative w-full mx-auto my-5 rounded-xl">
            {/* Cover Image Skeleton */}
            <div className="relative w-full h-48 overflow-hidden bg-gray-200 md:h-64 rounded-xl dark:bg-neutral-700 animate-pulse">
                {/* Empty div for skeleton */}
            </div>

            {/* Profile + Info Row Skeleton */}
            <div className="relative z-10 flex items-center gap-4 my-5">
                {/* Profile Image Skeleton */}
                <div className="w-32 h-32 bg-gray-300 rounded-full dark:bg-neutral-600 animate-pulse"></div>

                {/* Store Info Skeleton */}
                <div className="flex flex-col justify-center flex-1 space-y-3">
                    {/* Store Name Skeleton */}
                    <div className="w-64 bg-gray-300 rounded h-7 dark:bg-neutral-600 animate-pulse"></div>

                    {/* Description Skeleton */}
                    <div className="space-y-2">
                        <div className="w-1/2 h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                        <div className="w-4/5 h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                        <div className="w-3/5 h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                    </div>
                </div>

                {/* Edit Button Skeleton */}
                <div className="absolute top-0 p-2 right-2">
                    <div className='flex flex-col gap-2'>
                        <div className="w-24 h-8 bg-gray-200 border border-gray-300 rounded-full dark:bg-neutral-700 dark:border-neutral-600 animate-pulse"></div>
                        <div className="w-24 h-8 bg-gray-200 border border-gray-300 rounded-full dark:bg-neutral-700 dark:border-neutral-600 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DashboardStoreHeroSkeleton