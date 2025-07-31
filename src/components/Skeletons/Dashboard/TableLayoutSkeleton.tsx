import React from 'react'

const TableLayoutSkeleton = () => {
    return (
        <div className="py-6">
            <div className="overflow-hidden border rounded-lg dark:border-neutral-700 animate-pulse">
                {/* Table Header Skeleton */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-gray-100 dark:bg-neutral-800">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-300 rounded dark:bg-neutral-700"></div>
                        ))}
                    </div>
                </div>

                {/* Table Rows Skeleton */}
                <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {[...Array(5)].map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-1 gap-4 p-4 md:grid-cols-8 md:gap-4 md:p-0">
                            {/* Product Name & Category */}
                            <div className="md:px-4 md:py-4 md:whitespace-nowrap">
                                <div className="h-5 w-3/4 bg-gray-300 rounded dark:bg-neutral-700 mb-2"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded dark:bg-neutral-600"></div>
                            </div>

                            {/* Description */}
                            <div className="md:px-6 md:py-4 space-y-2">
                                <div className="h-4 w-full bg-gray-300 rounded dark:bg-neutral-700"></div>
                                <div className="h-4 w-4/5 bg-gray-300 rounded dark:bg-neutral-700"></div>
                            </div>

                            {/* Images */}
                            <div className="md:px-6 md:py-4">
                                <div className="flex justify-center gap-2">
                                    {[...Array(3)].map((_, imgIndex) => (
                                        <div key={imgIndex} className="w-10 h-10 bg-gray-300 rounded-md dark:bg-neutral-700"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="md:px-6 md:py-4">
                                <div className="h-5 w-8 mx-auto bg-gray-300 rounded dark:bg-neutral-700"></div>
                            </div>

                            {/* MRP */}
                            <div className="md:px-6 md:py-4">
                                <div className="h-5 w-16 mx-auto bg-gray-300 rounded dark:bg-neutral-700"></div>
                            </div>

                            {/* Discount */}
                            <div className="md:px-6 md:py-4">
                                <div className="h-5 w-12 mx-auto bg-gray-300 rounded dark:bg-neutral-700"></div>
                            </div>

                            {/* Price */}
                            <div className="md:px-6 md:py-4">
                                <div className="h-5 w-16 mx-auto bg-gray-300 rounded dark:bg-neutral-700"></div>
                            </div>

                            {/* Actions */}
                            <div className="md:px-6 md:py-4">
                                <div className="flex justify-center gap-4">
                                    <div className="w-5 h-5 bg-gray-300 rounded-full dark:bg-neutral-700"></div>
                                    <div className="w-5 h-5 bg-gray-300 rounded-full dark:bg-neutral-700"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-neutral-800">
                    <div className="h-4 w-24 bg-gray-200 rounded dark:bg-neutral-700"></div>
                    <div className="flex space-x-2">
                        <div className="h-8 w-20 bg-gray-200 rounded-md dark:bg-neutral-700"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded-md dark:bg-neutral-700"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableLayoutSkeleton