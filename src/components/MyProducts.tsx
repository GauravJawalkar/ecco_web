"use client"

import axios from 'axios';
import Image from 'next/image';
import { Key, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const MyProducts = ({ sellerId }: { sellerId: string }) => {

    const [prodData, setProdData] = useState([]);

    const getSellerProducts = async () => {

        try {
            const response = await axios.post('/api/getSellerProducts', { sellerId });
            setProdData(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSellerProducts()
    }, [])

    return (
        <div className='grid grid-cols-4 py-10 gap-10'>
            {
                prodData.length === 0 ? "No Products Found" :

                    prodData.map(
                        ({ _id, name, description, images, price, discount, category }: any) => {
                            return <div key={_id} className='border p-5'>
                                <div className=''>
                                    <Swiper modules={[EffectFade, Pagination]}
                                        pagination={{ clickable: true }} spaceBetween={50} effect="card" className='border rounded'>
                                        {images.map((elem: string, index: Key | null | undefined) => {
                                            return (
                                                <SwiperSlide key={index} className=''>
                                                    <Image src={elem} loading='lazy' alt='image prod' width={300} height={200} className='h-[400px] w-full object-cover rounded' />
                                                </SwiperSlide>
                                            )
                                        })}
                                    </Swiper>
                                    <h1 className='capitalize text-xl py-2 line-clamp-2'>
                                        {name}
                                    </h1>
                                    <p className='text-base text-gray-500 line-clamp-3'>
                                        {description}
                                    </p>
                                    <div className='py-2 flex items-center gap-5 justify-between'>
                                        <h1 className='font-light uppercase'>
                                            <span className='font-semibold'> Price </span> - ₹ {price}
                                        </h1>
                                        <h1 className='font-light uppercase'>
                                            <span className='font-semibold'>  Discount </span> - ₹ {discount}
                                        </h1>
                                    </div>
                                    <div className='font-light uppercase'>
                                        <span className='font-semibold'>  TOTAL </span> - ₹ {price - discount}
                                    </div>
                                </div>
                            </div>
                        }
                    )
            }
        </div>
    )
}

export default MyProducts