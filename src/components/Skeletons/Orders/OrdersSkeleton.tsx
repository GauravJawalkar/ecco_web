import React from 'react'

const OrdersSkeleton = () => {
    return (
        <section className="py-4">
            {/* Orders Grid Skeleton */}
            <div className="grid gap-5">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900/40 dark:border-neutral-800 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr]">
                            {/* Product Information Skeleton */}
                            <div className="flex items-start gap-4 p-5 border-b md:border-b-0 md:border-r border-gray-200 dark:border-neutral-800">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
                                </div>
                                <div className="w-full">
                                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded mb-2"></div>
                                    <div className="flex gap-4 mt-3">
                                        <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Information Skeleton */}
                            <div className="grid grid-cols-3 p-5 border-b md:border-b-0 md:border-r border-gray-200 dark:border-neutral-800">
                                <div className="text-center">
                                    <div className="h-4 w-10 bg-gray-200 dark:bg-neutral-700 rounded mx-auto mb-1"></div>
                                    <div className="h-5 w-16 bg-gray-300 dark:bg-neutral-600 rounded mx-auto"></div>
                                </div>
                                <div className="text-center">
                                    <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded mx-auto mb-1"></div>
                                    <div className="h-5 w-14 bg-gray-300 dark:bg-neutral-600 rounded mx-auto"></div>
                                </div>
                                <div className="text-center">
                                    <div className="h-4 w-10 bg-gray-200 dark:bg-neutral-700 rounded mx-auto mb-1"></div>
                                    <div className="h-5 w-16 bg-gray-300 dark:bg-neutral-600 rounded mx-auto"></div>
                                </div>
                            </div>

                            {/* Delivery & Status Skeleton */}
                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <div className="flex items-start gap-2 mb-1">
                                            <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded-full mt-0.5"></div>
                                            <div className="w-full">
                                                <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded mb-1"></div>
                                                <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded mb-1"></div>
                                                <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap gap-4">
                                            <div>
                                                <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded mb-1"></div>
                                                <div className="h-6 w-24 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
                                            </div>
                                            <div>
                                                <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded mb-1"></div>
                                                <div className="h-6 w-20 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default OrdersSkeleton