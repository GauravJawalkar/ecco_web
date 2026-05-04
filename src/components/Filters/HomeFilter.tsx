import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Modifiable Filters Array
export const Filters = [
    {
        _id: 1,
        category: "indoor plants",
        imageLink: "/Filters/indoor.png",
    },
    {
        _id: 2,
        category: "outdoor plants",
        imageLink: "/Filters/outdoor-plants.png",
    },
    {
        _id: 3,
        category: "herbal plants",
        imageLink: "/Filters/herball.png",
    },
    {
        _id: 4,
        category: "cactus plants",
        imageLink: "/Filters/cactusNew.png",
    },
    {
        _id: 5,
        category: "fruit plants",
        imageLink: "/Filters/fruits.png",
    },
    {
        _id: 6,
        category: "air purifying",
        imageLink: "/Filters/moneyFilter.png",
    },
    {
        _id: 7,
        category: "climber plants",
        imageLink: "/Filters/climber.png",
    },
    {
        _id: 8,
        category: "accessories",
        imageLink: "/Filters/accessories.png",
    }
]

const HomeFilter = () => {
    return (
        <div className='px-4 sm:px-5 pb-4 sm:pb-5 relative md:my-0 my-5 bg-transparent'>
            <div className='flex lg:grid lg:grid-cols-8 gap-4 sm:gap-6 lg:gap-7 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0 pt-4 sm:pt-5 pb-6 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-transparent scroll-smooth'>
                {
                    Filters.map(({ _id, category, imageLink }) => {
                        return (
                            <Link key={_id} href={`/products?category=${category}`} className='flex-shrink-0 w-[90px] sm:w-[140px] lg:w-auto snap-start flex items-center justify-start flex-col space-y-2 sm:space-y-3 group hover:-translate-y-2 transition-transform ease-linear cursor-pointer min-h-[44px] touch-manipulation' >
                                <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[90px] sm:h-[140px] lg:h-[150px] overflow-hidden flex-shrink-0' style={{ borderRadius: '100px 100px 15px 15px' }}>
                                    <Image
                                        height={300}
                                        width={300}
                                        sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 12vw"
                                        className='h-full w-full object-contain'
                                        src={imageLink}
                                        alt={category}
                                    />
                                </div>
                                <h1 className='font-normal text-xs truncate sm:text-base lg:text-lg group-hover:font-semibold transition-all ease-linear duration-100 capitalize text-center px-1 leading-tight'>{category}</h1>
                            </Link>
                        )
                    })
                }
                {/* Invisible spacer to fix iOS Safari ignoring right-padding on flex containers */}
                <div className="w-px flex-shrink-0 lg:hidden" aria-hidden="true" />
            </div>

            {/* All Products Page Tag */}
            <div className='absolute -top-12 sm:-top-8 right-0 group z-10'>
                <Link href={'/products'} className='bg-gray-100 dark:bg-neutral-800 px-4 lg:px-3 py-1 min-h-[34px] md:min-h-[40px] text-sm md:text-base rounded-l-full group-hover:font-semibold flex items-center justify-center transition-transform ease-linear duration-200 touch-manipulation'>
                    <span>See All Products</span>
                    <ChevronRight className='hidden group-hover:flex translate-x-1 h-5 w-5 transition-transform ease-linear duration-400' />
                </Link>
            </div>
        </div >
    )
}

export default HomeFilter