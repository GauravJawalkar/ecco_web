import React from 'react'

const StoreHeroSkeleton = () => {
    return (
        <div className="relative overflow-hidden border dark:border-neutral-800 dark:bg-neutral-900/60 rounded-b-lg animate-pulse">
            {/* Cover Image Skeleton */}
            <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200 dark:bg-neutral-700">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                {/* Floating Profile Card Skeleton */}
                <div className="absolute left-8 -bottom-16 z-10">
                    <div className="flex items-end gap-4">
                        <div className="relative">
                            <div className="border-4 border-white rounded-lg shadow-xl w-28 h-28 md:w-32 md:h-32 dark:border-neutral-800 bg-gray-200 dark:bg-neutral-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Info Section Skeleton */}
            <div className="pt-20 pb-8 px-6">
                <div className="">
                    {/* Store Header with CTA Skeleton */}
                    <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <div className="h-8 w-64 bg-gray-200 dark:bg-neutral-700 rounded" />
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                                    <div className="h-5 w-24 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 w-2/3 bg-gray-200 dark:bg-neutral-700 rounded" />
                            </div>

                            {/* Store Stats Skeleton */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                        <div className="p-2 bg-white rounded-full shadow dark:bg-neutral-700">
                                            <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-600 rounded-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex flex-row-reverse items-center justify-center gap-3">
                            <div className="h-11 w-32 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
                            <div className="h-11 w-32 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
                        </div>
                    </div>

                    {/* Category Tags and Social Links Skeleton */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-neutral-800">
                        <div className="flex flex-wrap gap-2">
                            <div className="h-6 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                            <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                            <div className="h-6 w-28 bg-gray-200 dark:bg-neutral-700 rounded-full" />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
                            <div className="flex gap-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-9 h-9 bg-gray-200 dark:bg-neutral-700 rounded-full" />
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