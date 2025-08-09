import { userProps } from '@/interfaces/commonInterfaces'
import React from 'react'

const ActionsSkeleton = ({ data }: { data: userProps }) => {
    return (
        <div className="flex items-center justify-start gap-3 p-4 dark:bg-neutral-850 rounded-lg border border-gray-150 dark:border-neutral-700 shadow-xs animate-pulse">
            {/* Add Product Button Skeleton */}
            <div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-neutral-700 rounded-md flex items-center gap-2 px-4 py-2.5">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                </div>
            </div>

            {/* Add Category Button Skeleton */}
            <div>
                <div className="h-10 w-36 bg-gray-200 dark:bg-neutral-700 rounded-md flex items-center gap-2 px-4 py-2.5">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                </div>
            </div>

            {/* Special Appearance Button Skeleton (conditional) */}
            {data?.isSuperAdmin && (
                <div>
                    <div className="h-10 w-40 bg-gray-200 dark:bg-neutral-700 rounded-md flex items-center gap-2 px-4 py-2.5">
                        <div className="w-5 h-5 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
                        <div className="h-4 w-24 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                    </div>
                </div>
            )}

            {/* Process Orders Button Skeleton */}
            <div>
                <div className="h-10 w-36 bg-gray-200 dark:bg-neutral-700 rounded-md flex items-center gap-2 px-4 py-2.5">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export default ActionsSkeleton