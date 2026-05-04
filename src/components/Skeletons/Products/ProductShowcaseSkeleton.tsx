import React from 'react'

const ProductShowcaseSkeleton = () => {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-0">
            <div className="h-auto p-3 sm:p-4 lg:p-5 border dark:border-neutral-700 dark:bg-neutral-950/20 rounded-xl relative">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="relative border dark:border-neutral-700 rounded-2xl lg:rounded-3xl animate-pulse flex flex-col h-full">
                            {/* Image placeholder */}
                            <div className="bg-gray-200 dark:bg-neutral-700 w-full h-32 sm:h-48 lg:h-64 rounded-t-2xl lg:rounded-t-3xl shrink-0"></div>

                            {/* Content placeholder */}
                            <div className="p-2 sm:p-3 lg:p-4 bg-gray-100 dark:bg-neutral-800 rounded-b-2xl lg:rounded-b-3xl grow flex flex-col justify-center">
                                <div className="bg-gray-200 dark:bg-neutral-700 h-4 sm:h-5 lg:h-6 w-3/4 mx-auto my-1 lg:my-1.5 rounded"></div>
                                <div className="bg-gray-200 dark:bg-neutral-700 h-3 sm:h-4 w-1/2 mx-auto rounded mt-1"></div>
                            </div>

                            {/* Badge placeholder */}
                            <div className="absolute top-0 right-0 px-2 h-4 sm:h-5 lg:h-6 w-16 sm:w-20 lg:w-24 bg-gray-300 dark:bg-neutral-600 rounded-tr-2xl lg:rounded-tr-3xl rounded-bl-lg sm:rounded-bl-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductShowcaseSkeleton