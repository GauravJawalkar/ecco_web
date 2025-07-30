import React from 'react'

const StoreProductsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-700/80 p-4 flex flex-col">
                    <div className="w-full h-40 rounded-md bg-gray-200 dark:bg-neutral-700 mb-3 animate-pulse"></div>
                    <div className="w-3/4 h-5 rounded bg-gray-200 dark:bg-neutral-700 mb-2 animate-pulse"></div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="w-1/3 h-6 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>
                        <div className="w-1/4 h-4 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StoreProductsSkeleton