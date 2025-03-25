"use client"

import axios from 'axios'
import Image from 'next/image'
import React, { Key, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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

    async function getSpecialAppearReq() {
        try {
            const response = await axios.get('../api/getSplAppReq')
            if (response.data.data) {
                setData(response.data.data)
                toast.success("Requests Fetched Successfully");
            }
        } catch (error) {
            console.log("Error Fetching the requests", error)
            toast.error("Error Fetching requests")
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
            <div className='grid grid-cols-10 place-items-start w-full border px-4 py-2'>
                <div className='col-span-2'>Name</div>
                <div className='col-span-1'>Images</div>
                <div className='col-span-1'>Price</div>
                <div className='col-span-1'>Discount</div>
                <div className='col-span-1'>Avatar</div>
                <div className='col-span-1'>Verified</div>
                <div className='col-span-2'>Seller Name</div>
                <div className='col-span-1'>Authorize</div>
            </div>
            {
                data.map(({ _id, prodName, prodPrice, prodImages, seller, prodDiscount, sellerAvatar, sellerName, isSellerVerified }: mapDataProps) => {
                    return (
                        <div key={_id} className='grid grid-cols-10 gap-4 border px-4 py-2'>
                            <div className='col-span-2'>
                                <h1 className='w-full line-clamp-1'>{prodName}</h1>
                            </div>

                            <div className='col-span-1'>
                                {
                                    prodImages.map((img: string, index: Key | null | undefined) => {
                                        return (
                                            <div key={index}>
                                                <Image src={img} alt='avatar' className='' height={20} width={20} />
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className='col-span-1'>
                                <h1>{prodPrice}</h1>
                            </div>

                            {/* {prodImages} */}
                            <div className='col-span-1'>
                                <h1>{prodDiscount}</h1>
                            </div>

                            <div className='col-span-1'>
                                <Image src={sellerAvatar} alt='avatar' height={20} width={20} />
                            </div>
                            <div className='col-span-1'>
                                <h1>{isSellerVerified ? "✅" : "❌"}</h1>
                            </div>
                            <div className='col-span-1 '>
                                <h1>{sellerName}</h1>
                            </div>

                            <div className='col-span-2  place-items-center'>
                                <button className=''>Set Appearence</button>
                            </div>
                        </div>
                    )
                })
            }

        </>
    )
}

export default SpecialShowCase