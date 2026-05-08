import React from 'react'

const DashboardStoreHeroSkeleton = () => {
    return (
        <section className="relative w-full mx-auto my-5 rounded-xl">
            {/* Cover Image Skeleton */}
            <div className="relative w-full h-32 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gray-200 rounded-xl dark:bg-neutral-700 animate-pulse"></div>

            {/* Profile + Info Row Skeleton */}
            <div className="relative px-4 sm:px-6 md:px-8 pb-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-end -mt-10 sm:-mt-12 md:-mt-16">
                {/* Profile Image Skeleton */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-2 sm:border-4 border-white dark:border-neutral-900 bg-gray-300 dark:bg-neutral-600 animate-pulse flex-shrink-0 z-10"></div>

                {/* Store Info Skeleton */}
                <div className="flex-1 w-full text-center sm:text-left flex flex-col items-center sm:items-start gap-2 pt-2 sm:pt-0">
                    {/* Store Name */}
                    <div className="h-6 sm:h-8 md:h-9 w-48 sm:w-64 bg-gray-300 rounded dark:bg-neutral-600 animate-pulse"></div>

                    {/* Description */}
                    <div className="w-full max-w-md space-y-1.5 mt-1 hidden sm:block">
                        <div className="w-full h-3 sm:h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                        <div className="w-5/6 h-3 sm:h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                    </div>

                    {/* Stats skeleton */}
                    <div className="hidden lg:flex items-center gap-4 pt-2">
                        <div className="w-24 h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                        <div className="w-24 h-4 bg-gray-200 rounded dark:bg-neutral-700 animate-pulse"></div>
                    </div>
                </div>

                {/* Edit Button */}
                <div className="absolute top-4 right-4 sm:static sm:mb-2">
                    <div className="w-8 h-8 sm:w-32 sm:h-10 bg-gray-200 rounded-lg sm:rounded-lg dark:bg-neutral-700 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}

export default DashboardStoreHeroSkeleton