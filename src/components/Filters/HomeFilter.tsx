import Image from 'next/image'
import React from 'react'

const HomeFilter = () => {
    return (
        <div className='p-5'>
            <div className='grid grid-cols-6 gap-7'>
                <div className='flex items-center justify-center flex-col space-y-3' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/indoor.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg'> Indoor Plants</h1>
                </div>
                <div className='flex items-center justify-center flex-col space-y-3' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/outdoor-plants.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg'> Outdoor Plants</h1>
                </div>
                <div className='flex items-center justify-center flex-col space-y-3' >
                    <div className='bg-gray-100 dark:bg-neutral-800 h-[150px] w-full overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/herball.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg'>Herbal Plants</h1>
                </div>
                <div className='flex items-center justify-center flex-col space-y-3' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/cactus.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg'>Cactus Plants</h1>
                </div>
                <div className='flex items-center justify-center flex-col space-y-3' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/fruits.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg'>Fruit-Bearing</h1>
                </div>
                <div className='flex items-center justify-center flex-col space-y-3' >
                    <div className='bg-gray-100 dark:bg-neutral-800 w-full h-[150px] overflow-hidden' style={{ borderRadius: '100px 100px 15px 15px' }}>
                        <Image height={300} width={300} className='h-full w-full object-contain' src={'/Filters/moneyFilter.png'} alt={'money-plant-filter'} />
                    </div>
                    <h1 className='font-normal text-lg'>Air Purifying</h1>
                </div>
            </div>
        </div >
    )
}

export default HomeFilter