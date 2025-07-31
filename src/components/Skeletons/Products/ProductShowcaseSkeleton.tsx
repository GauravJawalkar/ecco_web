import React from 'react'

const ProductShowcaseSkeleton = () => {
    return (
        <div className="w-full">
            <div className="h-auto p-5 border dark:border-neutral-700 dark:bg-neutral-950/20 rounded-xl">
                <div className="grid grid-cols-2 gap-5">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="relative border dark:border-neutral-700 rounded-3xl animate-pulse">
                            {/* Image placeholder */}
                            <div className="bg-gray-200 dark:bg-neutral-700 w-full h-64 rounded-t-3xl"></div>

                            {/* Content placeholder */}
                            <div className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-b-3xl">
                                <div className="bg-gray-200 dark:bg-neutral-700 h-6 w-3/4 mx-auto my-1.5 rounded"></div>
                                <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-1/2 mx-auto rounded"></div>
                            </div>

                            {/* Badge placeholder */}
                            <div className="absolute top-0 right-0 px-2 h-6 w-24 bg-gray-300 rounded-tr-xl rounded-bl-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductShowcaseSkeleton