import { userProps } from '@/interfaces/commonInterfaces'
import React from 'react'

const ActionsSkeleton = ({ data }: { data: userProps }) => {
    return (
        <div className="my-4 flex overflow-x-auto no-scrollbar items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-xl shadow-xs dark:bg-neutral-850 border-gray-150 dark:border-neutral-700 relative z-10 sm:flex-wrap animate-pulse">
            {/* Add Product Button Skeleton */}
            <div className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-gray-200 dark:bg-neutral-700 w-28 sm:w-32 h-8 sm:h-10">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 dark:bg-neutral-600 rounded-full flex-shrink-0"></div>
                <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-300 dark:bg-neutral-600 rounded"></div>
            </div>

            {/* Add Category Button Skeleton */}
            <div className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-gray-200 dark:bg-neutral-700 w-32 sm:w-36 h-8 sm:h-10">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 dark:bg-neutral-600 rounded-full flex-shrink-0"></div>
                <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-300 dark:bg-neutral-600 rounded"></div>
            </div>

            {/* Special Appearance Button Skeleton (conditional) */}
            {data?.isSuperAdmin && (
                <div className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-gray-200 dark:bg-neutral-700 w-32 sm:w-36 h-8 sm:h-10">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 dark:bg-neutral-600 rounded-full flex-shrink-0"></div>
                    <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                </div>
            )}

            {/* Process Orders Button Skeleton */}
            <div className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-gray-200 dark:bg-neutral-700 w-24 sm:w-28 h-8 sm:h-10">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 dark:bg-neutral-600 rounded-full flex-shrink-0"></div>
                <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-300 dark:bg-neutral-600 rounded"></div>
            </div>
        </div>
    )
}

export default ActionsSkeleton