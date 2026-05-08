import React from 'react'

const StatsSkeleton = ({ isAdmin }: { isAdmin: boolean }) => {
    return (
        <div className="my-4">
            {/* ── MOBILE: horizontal compact rows ── */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
                {[...Array(isAdmin ? 5 : 4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2 p-2.5 rounded-xl border border-gray-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 animate-pulse">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
                            <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        </div>
                        <div className="h-6 w-12 bg-gray-300 dark:bg-neutral-600 rounded mt-1"></div>
                    </div>
                ))}
            </div>

            {/* ── DESKTOP: horizontal flex wrap ── */}
            <div className="hidden sm:flex flex-wrap items-center gap-3 w-full lg:w-fit">
                {[...Array(isAdmin ? 5 : 4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
                        <div className="flex flex-col gap-1.5">
                            <div className="h-3 w-20 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                            <div className="h-5 w-16 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StatsSkeleton