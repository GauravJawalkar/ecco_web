
const MainProductsPageSkeleton = () => {
    return (
        <>
            {[...Array(8)].map((_, index) => (
                <div
                    key={index}
                    className="content-center flex items-center justify-center flex-col bg-gray-100 dark:bg-neutral-800 rounded-b-3xl rounded-t-2xl w-full animate-pulse">
                    {/* Image placeholder */}
                    <div className="w-full py-3 sm:py-4">
                        <div className="h-36 sm:h-48 lg:h-64 w-full bg-gray-100 dark:bg-neutral-700 rounded" />
                    </div>

                    {/* Content placeholder */}
                    <div className="p-2.5 sm:p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-b-xl md:rounded-3xl border">
                        {/* Category & Rating row */}
                        <div className="flex items-center justify-between pb-1.5 sm:pb-2">
                            <div className="h-3 sm:h-4 w-5 bg-gray-200 dark:bg-neutral-700 rounded" />
                            <div className="h-3 sm:h-4 w-5 bg-gray-200 dark:bg-neutral-700 rounded" />
                        </div>

                        {/* Product name */}
                        <div className="my-1 lg:my-1.5 min-h-[2rem] lg:min-h-[3.5rem] space-y-1.5">
                            <div className="h-3 sm:h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded" />
                            <div className="h-3 sm:h-4 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded" />
                        </div>

                        {/* Price & Cart button row */}
                        <div className="flex items-center justify-between pt-2">
                            {/* Cart button placeholder */}
                            <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-200 dark:bg-neutral-700 rounded-full" />

                            {/* Price placeholder */}
                            <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                                <div className="h-3 sm:h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 sm:h-5 w-14 sm:w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default MainProductsPageSkeleton