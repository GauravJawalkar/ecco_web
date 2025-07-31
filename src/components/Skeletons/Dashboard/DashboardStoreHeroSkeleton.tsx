import React from 'react'

const DashboardStoreHeroSkeleton = () => {
    return (
        <section className="relative w-full mx-auto my-5 rounded-xl">
            {/* Cover Image Skeleton */}
            <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden bg-gray-200 dark:bg-neutral-700 animate-pulse">
                {/* Empty div for skeleton */}
            </div>

            {/* Profile + Info Row Skeleton */}
            <div className="relative z-10 flex items-center gap-4 my-5">
                {/* Profile Image Skeleton */}
                <div className="w-32 h-32 bg-gray-300 rounded-full dark:bg-neutral-600 animate-pulse"></div>

                {/* Store Info Skeleton */}
                <div className="flex flex-col justify-center space-y-3 flex-1">
                    {/* Store Name Skeleton */}
                    <div className="h-7 w-64 bg-gray-300 rounded dark:bg-neutral-600 animate-pulse"></div>

                    {/* Description Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                        <div className="h-4 w-4/5 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                        <div className="h-4 w-3/5 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-24 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                    </div>
                </div>

                {/* Edit Button Skeleton */}
                <div className="absolute top-0 p-2 bg-gray-200 border border-gray-300 rounded-full right-2 dark:bg-neutral-700 dark:border-neutral-600 animate-pulse">
                    <div className="w-5 h-5"></div>
                </div>
            </div>
        </section>
    )
}

export default DashboardStoreHeroSkeleton