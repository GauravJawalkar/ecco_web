import React from 'react'

const MainStoreSkeleton = () => {
    return (
        <div className="group bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-neutral-700 animate-pulse">
            {/* Cover Image Skeleton */}
            <div className="relative w-full h-40 md:h-48 overflow-hidden bg-gray-200 dark:bg-neutral-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Store Logo Skeleton */}
            <div className="px-4 -mt-12 z-10">
                <div className="relative w-20 h-20 rounded-xl border-2 border-gray-300 dark:border-neutral-700 shadow-lg bg-gray-200 dark:bg-neutral-700">
                    <div className="absolute -top-2 -right-2 bg-gray-200 dark:bg-neutral-600 rounded-full p-1 h-5 w-5"></div>
                </div>
            </div>

            {/* Store Info Skeleton */}
            <div className="py-5 pb-5 px-4">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="flex items-center mt-3">
                            <div className="h-4 w-4 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                            <div className="h-3 w-12 ml-2 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                            <div className="h-3 w-3 mx-2 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                            <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        </div>
                    </div>
                    <div className="h-5 w-16 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="h-3 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                        <div className="h-3 w-16 ml-2 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                    <div className="h-9 w-24 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}

export default MainStoreSkeleton