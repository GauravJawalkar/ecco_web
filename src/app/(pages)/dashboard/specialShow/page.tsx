"use client"

import axios from 'axios'
import Image from 'next/image'
import React, { Key, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";

interface mapDataProps {
    _id: string,
    prodName: string,
    prodPrice: string,
    prodImages: [string],
    seller: string,
    prodDiscount: string,
    sellerAvatar: string
    sellerName: string,
    isSellerVerified: boolean
}

const SpecialShowCase = () => {
    const [data, setData] = useState([]);
    const [backupData, setBackupData] = useState([]);

    async function getSpecialAppearReq() {
        try {
            const response = await axios.get('../api/getSplAppReq')
            if (response.data.data) {
                setData(response.data.data)
                setBackupData(response.data)
                toast.success("Requests Fetched Successfully");
            }
        } catch (error) {
            console.log("Error Fetching the requests", error)
            toast.error("Error Fetching requests")
        }
    }

    const handelSplReq = async (_id: string) => {
        try {
            const response = await axios.put('../api/setSplAppearence', { _id })

            if (response.data.data) {
                toast.success("Special Product Updated")
                setData(backupData);
            } else {
                toast.error("Error setting special");
            }
        } catch (error) {
            console.log("Error setting special", error)
            toast.error("Error setting special");
        }
    }

    useEffect(() => {
        getSpecialAppearReq();
    }, [])

    return (
        <>
            <div className='flex items-center justify-center py-10'>
                <h1 className='text-3xl font-semibold capitalize'>set Products for Special Appearence</h1>
            </div>
            <div className='grid grid-cols-10 place-items-start w-full border px-4 py-2 '>
                <div className='col-span-2'>Product Name</div>
                <div className='col-span-2'>Images</div>
                <div className='col-span-1'>Price</div>
                <div className='col-span-1'>Discount</div>
                <div className='col-span-1'>Avatar</div>
                <div className='col-span-1 place-items-center'>
                    <h1> Seller Name</h1>
                </div>
                <div className='col-span-1'>Verified</div>
                <div className='col-span-1'>Set Appearence</div>
            </div>
            {data.map(({ _id, prodName, prodPrice, prodImages, prodDiscount, sellerAvatar, sellerName, isSellerVerified }: mapDataProps) => {
                return (
                    <div key={_id} className='grid grid-cols-10 gap-4 border px-4 py-2  '>
                        <div className='col-span-2'>
                            <h1 className='w-full line-clamp-1 capitalize'>{prodName}</h1>
                        </div>

                        {/* {prodImages} */}
                        <div className='col-span-2'>
                            <Swiper
                                modules={[EffectFade, Pagination]}
                                pagination={{ clickable: true }}
                                slidesPerView={4}
                                spaceBetween={5}
                                effect="card"
                                className='w-full'
                            >
                                {prodImages.map(
                                    (elem: string, index: Key | null | undefined) => {
                                        return (
                                            <SwiperSlide key={index} className="">
                                                <Image
                                                    src={elem}
                                                    loading="lazy"
                                                    alt="image prod"
                                                    width={100}
                                                    height={100}
                                                    className="h-10 w-10 object-cover rounded"
                                                />
                                            </SwiperSlide>
                                        );
                                    }
                                )}
                            </Swiper>
                        </div>

                        <div className='col-span-1'>
                            <h1>{prodPrice}</h1>
                        </div>

                        <div className='col-span-1'>
                            <h1>{prodDiscount}</h1>
                        </div>

                        <div className='col-span-1'>
                            <Image src={sellerAvatar} alt='avatar' className="h-10 w-10 object-cover rounded" height={20} width={20} />
                        </div>

                        <div className='col-span-1 place-items-start'>
                            <h1 className='capitalize w-full'>{sellerName}</h1>
                        </div>
                        <div className='col-span-1'>
                            <h1>{isSellerVerified ? "✅" : "❌"}</h1>
                        </div>

                        <div className='col-span-1  place-items-center'>
                            <button
                                onClick={() => handelSplReq(_id)}
                                className=' py-1 px-4 rounded text-white bg-green-500 hover:bg-green-600'>Set</button>
                        </div>
                    </div>
                )
            })
            }

        </>
    )
}

export default SpecialShowCase