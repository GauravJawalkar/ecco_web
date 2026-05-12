import React from 'react'

const TableLayoutSkeleton = () => {
    return (
        <div className="py-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden animate-pulse">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-neutral-800/60 bg-gray-50/50 dark:bg-neutral-900/30">
                                <th className="px-6 py-4 w-[30%]">
                                    <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
                                </th>
                                <th className="px-6 py-4 hidden md:table-cell w-[35%]">
                                    <div className="h-3 w-20 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
                                </th>
                                <th className="px-6 py-4 w-[10%] text-center">
                                    <div className="h-3 w-12 bg-gray-200 dark:bg-neutral-700 rounded-md mx-auto"></div>
                                </th>
                                <th className="px-6 py-4 w-[15%] text-right">
                                    <div className="h-3 w-14 bg-gray-200 dark:bg-neutral-700 rounded-md ml-auto"></div>
                                </th>
                                <th className="px-6 py-4 w-[10%] text-center">
                                    <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded-md mx-auto"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/60">
                            {[...Array(5)].map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-neutral-800 shrink-0"></div>
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded-md max-w-[120px]"></div>
                                                <div className="h-3 w-1/3 bg-gray-100 dark:bg-neutral-800/60 rounded-md mt-1.5"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="space-y-2 max-w-[240px]">
                                            <div className="h-3 w-full bg-gray-200 dark:bg-neutral-800 rounded-md"></div>
                                            <div className="h-3 w-4/5 bg-gray-200 dark:bg-neutral-800 rounded-md"></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <div className="h-5 w-10 bg-gray-200 dark:bg-neutral-800 rounded-full"></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-800 rounded-md"></div>
                                            <div className="h-3 w-20 bg-gray-100 dark:bg-neutral-800/60 rounded-md"></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-neutral-800"></div>
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-neutral-800"></div>
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-neutral-800"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 dark:bg-neutral-900/30 border-t border-gray-100 dark:border-neutral-800/60">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-neutral-800 rounded-md"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-gray-200 dark:bg-neutral-800 rounded-lg"></div>
                        <div className="h-8 w-20 bg-gray-200 dark:bg-neutral-800 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableLayoutSkeleton