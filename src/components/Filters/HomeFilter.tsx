import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const HomeFilter = () => {
    return (
        <div className='p-5'>
            <div className='grid grid-cols-7 gap-7'>
                <Link href={'/'} className='flex items-center justify-center flex-col space-y-3 group hover:-translate-y-2 transition-transform ease-linear' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/indoor.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100'> Indoor Plants</h1>
                </Link>
                <Link href={'/'} className='flex items-center justify-center flex-col space-y-3 group  hover:-translate-y-2 transition-transform ease-linear' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/outdoor-plants.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100'> Outdoor Plants</h1>
                </Link>
                <Link href={'/'} className='flex items-center justify-center flex-col space-y-3 group  hover:-translate-y-2 transition-transform ease-linear' >
                    <div className='bg-gray-100 dark:bg-neutral-800 h-[150px] w-full overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/herball.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100'>Herbal Plants</h1>
                </Link>
                <Link href={'/'} className='flex items-center justify-center flex-col space-y-3 group  hover:-translate-y-2 transition-transform ease-linear' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/cactusNew.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100'>Cactus Plants</h1>
                </Link>
                <Link href={'/'} className='flex items-center justify-center flex-col space-y-3 group  hover:-translate-y-2 transition-transform ease-linear' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/fruits.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100'>Fruit-Bearing</h1>
                </Link>
                <Link href={'/'} className='flex items-center justify-center flex-col space-y-3 group  hover:-translate-y-2 transition-transform ease-linear' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/moneyFilter.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100'>Air Purifying</h1>
                </Link>
                <Link href={'/'} className='flex items-center justify-center flex-col space-y-3 group hover:-translate-y-2 transition-transform ease-linear' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/climber.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg group-hover:font-semibold transition-all ease-linear duration-100'>Climber Plants</h1>
                </Link>
            </div>
        </div >
    )
}

export default HomeFilter