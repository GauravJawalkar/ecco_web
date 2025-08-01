import React from 'react'

const StatsSkeleton = ({ isAdmin }: { isAdmin: boolean }) => {
    return (
        <div className={`grid ${isAdmin ? "grid-cols-5" : "grid-cols-4"} gap-6 my-8`}>
            {/* Total Products Skeleton */}
            <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 group animate-pulse'>
                <div className='flex flex-col items-center justify-center gap-3'>
                    <div className='p-3 rounded-full bg-gray-200 dark:bg-neutral-700 transition-all duration-300'>
                        <div className='size-6 bg-gray-300 dark:bg-neutral-600 rounded-full'></div>
                    </div>
                    <div className='h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                    <div className='h-8 w-12 bg-gray-300 dark:bg-neutral-600 rounded'></div>
                </div>
            </div>

            {/* Orders Received Skeleton */}
            <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 group animate-pulse'>
                <div className='flex flex-col items-center justify-center gap-3'>
                    <div className='p-3 rounded-full bg-gray-200 dark:bg-neutral-700 transition-all duration-300'>
                        <div className='size-6 bg-gray-300 dark:bg-neutral-600 rounded-full'></div>
                    </div>
                    <div className='h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                    <div className='h-8 w-12 bg-gray-300 dark:bg-neutral-600 rounded'></div>
                </div>
            </div>

            {/* Estimated Revenue Skeleton */}
            <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 group animate-pulse'>
                <div className='flex flex-col items-center justify-center gap-3'>
                    <div className='p-3 rounded-full bg-gray-200 dark:bg-neutral-700 transition-all duration-300'>
                        <div className='size-6 bg-gray-300 dark:bg-neutral-600 rounded-full'></div>
                    </div>
                    <div className='h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                    <div className='h-8 w-16 bg-gray-300 dark:bg-neutral-600 rounded'></div>
                </div>
            </div>

            {/* KYC Status Skeleton */}
            <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 group animate-pulse'>
                <div className='flex flex-col items-center justify-center gap-3'>
                    <div className='p-3 rounded-full bg-gray-200 dark:bg-neutral-700 transition-all duration-300'>
                        <div className='size-6 bg-gray-300 dark:bg-neutral-600 rounded-full'></div>
                    </div>
                    <div className='h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                    <div className='h-8 w-20 bg-gray-300 dark:bg-neutral-600 rounded'></div>
                </div>
            </div>

            {/* Seller Requests Skeleton (Admin Only) */}
            {isAdmin && (
                <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 group animate-pulse'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-gray-200 dark:bg-neutral-700 transition-all duration-300'>
                            <div className='size-6 bg-gray-300 dark:bg-neutral-600 rounded-full'></div>
                        </div>
                        <div className='h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded'></div>
                        <div className='h-8 w-12 bg-gray-300 dark:bg-neutral-600 rounded'></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StatsSkeleton