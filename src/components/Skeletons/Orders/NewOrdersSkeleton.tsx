import React from 'react'

const NewOrdersSkeleton = () => {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
                    {/* Order Header Skeleton */}
                    <div className="border-b border-gray-200 dark:border-neutral-700 px-6 py-4 flex flex-wrap justify-between items-center animate-pulse">
                        <div className="mb-2 sm:mb-0">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded mb-1"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        </div>
                        <div className="mb-2 sm:mb-0">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded mb-1"></div>
                            <div className="h-5 w-28 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        </div>
                        <div className="mb-2 sm:mb-0">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded mb-1"></div>
                            <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        </div>
                    </div>

                    {/* Order Content Skeleton */}
                    <div className="p-6 animate-pulse">
                        <div className="flex flex-col md:flex-row">
                            {/* Order Image and Details Skeleton */}
                            <div className="flex flex-1 mb-4 md:mb-0">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
                                <div className="ml-4 space-y-2">
                                    <div className="h-5 w-48 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-4 w-40 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                </div>
                            </div>

                            {/* Order Status and Actions Skeleton */}
                            <div className="flex flex-col items-start md:items-end space-y-3">
                                <div className="h-6 w-48 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                                <div className="h-6 w-40 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                                <div className="h-8 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                            </div>
                        </div>

                        {/* Delivery Information Skeleton */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                            <div className="flex flex-wrap">
                                <div className="w-full md:w-1/2 mb-4 md:mb-0 space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                </div>
                                <div className="w-full md:w-1/2 space-y-2">
                                    <div className="h-4 w-40 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NewOrdersSkeleton