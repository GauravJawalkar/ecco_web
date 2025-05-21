import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


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
        <div className='p-5 relative '>
            <div className='grid grid-cols-8 gap-7 w-full'>
                {
                    Filters.map(({ _id, category, imageLink }) => {
                        return (
                            <Link key={_id} href={`/products?category=${category}`} className='flex items-center justify-center flex-col space-y-3 group hover:-translate-y-2 transition-transform ease-linear cursor-pointer' >
                                <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                                    <Image height={300} width={300} className='h-full w-full object-contain' src={imageLink} alt={'filter-money'} />
                                </div>
                                <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100 capitalize'>{category}</h1>
                            </Link>
                        )
                    })
                }
            </div>

            {/* All Products Page Tag */}
            <div className='absolute -top-8 right-0 group'>
                <Link href={'/products'} className='bg-gray-100 px-3 py-2 rounded-l-full group-hover:font-semibold flex items-center justify-center transition-transform ease-linear duration-200 dark:bg-neutral-800'>
                    <span>All Products</span>
                    <ChevronRight className='hidden group-hover:flex translate-x-1 h-5 w-5 transition-transform ease-linear duration-400' />
                </Link>
            </div>
        </div >
    )
}

export default HomeFilter