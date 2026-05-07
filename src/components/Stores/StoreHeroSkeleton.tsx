import React from 'react'

const StoreHeroSkeleton = () => {
    return (
        <div className="relative overflow-hidden border dark:border-neutral-800 dark:bg-neutral-900/60 rounded-b-lg animate-pulse">
            {/* Cover Image Skeleton */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200 dark:bg-neutral-700">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                {/* Floating Profile Card Skeleton */}
                <div className="absolute z-10 left-4 sm:left-6 lg:left-8 -bottom-10 sm:-bottom-12 md:-bottom-16">
                    <div className="flex items-end gap-4">
                        <div className="relative">
                            <div className="border-[3px] sm:border-4 border-white rounded-lg shadow-xl w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 dark:border-neutral-800 bg-gray-200 dark:bg-neutral-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Info Section Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 md:pt-20 pb-6 sm:pb-8">
                <div className="">
                    {/* Store Header with CTA Skeleton */}
                    <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:justify-between lg:items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 dark:bg-neutral-700 rounded" />
                                <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
                                    <div className="h-4 sm:h-5 w-16 sm:w-20 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                                    <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2 mt-2 sm:mt-0">
                                <div className="h-3 sm:h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded" />
                                <div className="h-3 sm:h-4 w-2/3 bg-gray-200 dark:bg-neutral-700 rounded" />
                            </div>

                            {/* Store Stats Skeleton */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-2 mt-5 sm:mt-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 lg:p-3 rounded-xl lg:rounded-lg bg-gray-50 border border-gray-100 dark:bg-neutral-800/80 dark:border-neutral-700/50">
                                        <div className="p-2 sm:p-2.5 lg:p-2 bg-white rounded-full shadow-sm dark:bg-neutral-700 flex-shrink-0">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 dark:bg-neutral-600 rounded-full" />
                                        </div>
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="h-2.5 sm:h-3 w-12 sm:w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
                                            <div className="h-3 sm:h-4 w-16 sm:w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-3 mt-6 lg:mt-0 min-w-[200px]">
                            <div className="h-11 w-full lg:w-36 bg-gray-200 dark:bg-neutral-700 rounded-xl lg:rounded-lg" />
                            <div className="h-11 w-full lg:w-36 bg-gray-200 dark:bg-neutral-700 rounded-xl lg:rounded-lg" />
                        </div>
                    </div>

                    {/* Category Tags and Social Links Skeleton */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-4 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200 dark:border-neutral-800">
                        <div className="flex flex-wrap gap-2">
                            <div className="h-8 sm:h-6 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                            <div className="h-8 sm:h-6 w-24 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                            <div className="h-8 sm:h-6 w-28 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
                            <div className="flex gap-3 sm:gap-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-10 h-10 sm:w-9 sm:h-9 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreHeroSkeleton