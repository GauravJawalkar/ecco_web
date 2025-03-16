"use client"

import Image from 'next/image'
import React from 'react'
import userProfile from '../../public/userProfile.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
// import 'swiper/css/pagination';
import "../app/globals.css";



interface ProductHolderProps {
    rank: number
}

const ProductHolder = ({ rank }: ProductHolderProps) => {
    return (
        <div className='my-10'>
            <div className='grid grid-cols-[1fr_2fr] gap-10 h-64' dir={`${rank % 2 ? "ltr" : "rtl"}`} >
                <div className='border p-5 bg-red-100 '>
                    1
                </div>


                <div className='h-64 max-w-[87ch] prod-holder'>

                    {/* Product Card */}
                    <Swiper
                        slidesPerView={4}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={false}
                        modules={[Autoplay, Pagination, Navigation]}
                    >
                        <SwiperSlide>
                            <div className=' border content-center flex items-center justify-center flex-col w-fit'>
                                <Image
                                    src={userProfile}
                                    alt='prodImage'
                                    width={'180'}
                                    height={'180'}
                                    className='bg-white object-cover h-auto w-auto border-b' />
                                <div className='text-center py-1'>
                                    <p className='font-normal capitalize text-[16px]'>Flowering Plants</p>
                                    <h1 className='font-semibold uppercase text-lg'>From $200</h1>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className=' border content-center flex items-center justify-center flex-col w-fit'>
                                <Image
                                    src={userProfile}
                                    alt='prodImage'
                                    width={'180'}
                                    height={'180'}
                                    className='bg-white object-cover h-auto w-auto border-b' />
                                <div className='text-center py-1'>
                                    <p className='font-normal capitalize text-[16px]'>Flowering Plants</p>
                                    <h1 className='font-semibold uppercase text-lg'>From $200</h1>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className=' border content-center flex items-center justify-center flex-col w-fit'>
                                <Image
                                    src={userProfile}
                                    alt='prodImage'
                                    width={'180'}
                                    height={'180'}
                                    className='bg-white object-cover h-auto w-auto border-b' />
                                <div className='text-center py-1'>
                                    <p className='font-normal capitalize text-[16px]'>Flowering Plants</p>
                                    <h1 className='font-semibold uppercase text-lg'>From $200</h1>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className=' border content-center flex items-center justify-center flex-col w-fit'>
                                <Image
                                    src={userProfile}
                                    alt='prodImage'
                                    width={'180'}
                                    height={'180'}
                                    className='bg-white object-cover h-auto w-auto border-b' />
                                <div className='text-center py-1'>
                                    <p className='font-normal capitalize text-[16px]'>Flowering Plants</p>
                                    <h1 className='font-semibold uppercase text-lg'>From $200</h1>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className=' border content-center flex items-center justify-center flex-col w-fit'>
                                <Image
                                    src={userProfile}
                                    alt='prodImage'
                                    width={'180'}
                                    height={'180'}
                                    className='bg-white object-cover h-auto w-auto border-b' />
                                <div className='text-center py-1'>
                                    <p className='font-normal capitalize text-[16px]'>Flowering Plants</p>
                                    <h1 className='font-semibold uppercase text-lg'>From $200</h1>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className=' border content-center flex items-center justify-center flex-col w-fit'>
                                <Image
                                    src={userProfile}
                                    alt='prodImage'
                                    width={'180'}
                                    height={'180'}
                                    className='bg-white object-cover h-auto w-auto border-b' />
                                <div className='text-center py-1'>
                                    <p className='font-normal capitalize text-[16px]'>Flowering Plants</p>
                                    <h1 className='font-semibold uppercase text-lg'>From $200</h1>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className=' border content-center flex items-center justify-center flex-col w-fit'>
                                <Image
                                    src={userProfile}
                                    alt='prodImage'
                                    width={'180'}
                                    height={'180'}
                                    className='bg-white object-cover h-auto w-auto border-b' />
                                <div className='text-center py-1'>
                                    <p className='font-normal capitalize text-[16px]'>Flowering Plants</p>
                                    <h1 className='font-semibold uppercase text-lg'>From $200</h1>
                                </div>
                            </div>
                        </SwiperSlide>

                    </Swiper>

                </div>
            </div>
        </div >
    )
}

export default ProductHolder