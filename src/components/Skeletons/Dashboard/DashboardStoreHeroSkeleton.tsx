
const DashboardStoreHeroSkeleton = () => {
    return (
        <section className="relative w-full my-5 rounded-xl">
            {/* Cover Image Skeleton */}
            <div className="relative w-full h-48 overflow-hidden md:h-64 rounded-xl bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>

            {/* Profile + Info Row Skeleton */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-start lg:items-center gap-4 my-5">
                {/* Profile Image Skeleton */}
                <div className="w-28 h-28 bg-gray-300 border-4 border-white rounded-full dark:border-neutral-900 dark:bg-neutral-800 -mt-12 sm:-mt-0 sm:-translate-y-8 lg:translate-y-0 z-20 shadow-sm relative animate-pulse flex-shrink-0"></div>

                {/* Store Info Skeleton */}
                <div className="flex flex-col justify-center items-start sm:items-start space-y-2 text-start sm:text-left w-full mt-2 sm:mt-0">
                    {/* Store Name */}
                    <div className="h-7 w-48 sm:w-64 bg-gray-300 rounded dark:bg-neutral-700 animate-pulse"></div>

                    {/* Description */}
                    <div className="w-full max-w-lg space-y-1.5 pt-1">
                        <div className="w-full h-4 bg-gray-200 rounded dark:bg-neutral-800 animate-pulse"></div>
                        <div className="w-5/6 h-4 bg-gray-200 rounded dark:bg-neutral-800 animate-pulse"></div>
                    </div>

                    {/* Stats skeleton */}
                    <div className="hidden lg:flex items-center gap-4 pt-2 w-full">
                        <div className="w-24 h-4 bg-gray-200 rounded dark:bg-neutral-800 animate-pulse"></div>
                    </div>
                </div>

                {/* Edit Button Skeleton */}
                <div className="absolute top-0 right-0 flex items-center gap-2">
                    <div className="flex">
                        <div className="w-9 h-9 sm:w-[150px] sm:h-9 bg-gray-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full animate-pulse right-2 shadow-sm"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DashboardStoreHeroSkeleton