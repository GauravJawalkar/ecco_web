import React from 'react'

const NewOrdersSkeleton = () => {
    return (
        <div className="space-y-4 sm:space-y-6">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-neutral-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden animate-pulse">
                    {/* Order Header Skeleton */}
                    <div className="border-b border-gray-100 dark:border-neutral-700/80 px-4 sm:px-6 py-4 bg-gray-50/50 dark:bg-neutral-800/80 flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="flex justify-between sm:block">
                            <div className="h-3 w-16 sm:w-20 bg-gray-200 dark:bg-neutral-700 rounded mb-1.5 sm:mb-1"></div>
                            <div className="h-4 w-24 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                        </div>
                        <div className="flex justify-between sm:block sm:place-items-center">
                            <div className="h-3 w-10 sm:w-16 bg-gray-200 dark:bg-neutral-700 rounded mb-1.5 sm:mb-1"></div>
                            <div className="h-4 w-20 sm:w-28 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                        </div>
                        <div className="flex flex-col sm:place-items-end pt-3 border-t border-gray-200 dark:border-neutral-700 sm:border-0 sm:pt-0">
                            <div className="flex justify-between sm:block sm:text-right">
                                <div className="h-3 w-16 sm:w-16 bg-gray-200 dark:bg-neutral-700 rounded mb-1.5 sm:mb-1"></div>
                                <div className="h-4 w-24 sm:w-32 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* Order Content Skeleton */}
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-5">
                            {/* Order Image and Details Skeleton */}
                            <div className="flex flex-1 gap-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 dark:bg-neutral-700/80 rounded-lg flex-shrink-0"></div>
                                <div className="flex flex-col justify-center space-y-2.5 sm:space-y-3 w-full">
                                    <div className="h-5 w-3/4 sm:w-48 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status and Actions Skeleton */}
                            <div className="flex flex-col items-start sm:items-end space-y-2.5 sm:min-w-[180px]">
                                <div className="w-full sm:w-auto h-8 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                                <div className="w-full sm:w-auto h-8 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                                <div className="w-full sm:w-auto h-[44px] sm:h-9 bg-gray-200 dark:bg-neutral-700 rounded-lg sm:rounded-md mt-3 sm:mt-1"></div>
                            </div>
                        </div>

                        {/* Delivery Information Skeleton */}
                        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-neutral-700">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
                                <div className="w-full space-y-2.5">
                                    <div className="h-4 w-32 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                                    <div className="h-3.5 w-full bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    <div className="h-3.5 w-24 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                </div>
                                <div className="w-full sm:place-items-center border-t border-gray-100 dark:border-neutral-800 pt-4 sm:pt-0 sm:border-0 space-y-2.5">
                                    <div className="h-4 w-32 sm:w-32 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                                    <div className="h-3.5 w-24 sm:w-24 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                </div>
                                <div className="w-full sm:place-items-end border-t border-gray-100 dark:border-neutral-800 pt-4 sm:pt-0 sm:border-0 space-y-2.5">
                                    <div className="h-4 w-32 sm:w-32 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                                    <div className="h-3.5 w-28 sm:w-28 bg-gray-200 dark:bg-neutral-700 rounded"></div>
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