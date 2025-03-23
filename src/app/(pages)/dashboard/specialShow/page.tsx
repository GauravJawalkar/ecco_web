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
            {
                data.map(({ _id, prodName, prodPrice, prodImages, seller, prodDiscount, sellerAvatar, sellerName, isSellerVerified }: mapDataProps) => {
                    return (
                        <div key={_id} className='flex items-center justify-center gap-3 w-full'>
                            <div>
                                <label >Name</label>
                                <h1>{prodName}</h1>
                            </div>

                            <div>
                                <label >Images</label>
                                {
                                    prodImages.map((img: string, index: Key | null | undefined) => {
                                        return (
                                            <div key={index}>
                                                <Image src={img} alt='avatar' height={20} width={20} />
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div>
                                <label >Price</label>
                                <h1>{prodPrice}</h1>
                            </div>

                            {/* {prodImages} */}
                            <div>
                                <label >Disc</label>
                                <h1>{prodDiscount}</h1>
                            </div>

                            <div>
                                <label >Avatar</label>
                                <Image src={sellerAvatar} alt='avatar' height={20} width={20} />
                            </div>
                            <div>
                                <label >Seller Name</label>
                                <h1>{sellerName}</h1>
                            </div>

                            <div>
                                <label >Seller Verified</label>
                                <h1>{isSellerVerified ? "✅" : "❌"}</h1>
                            </div>
                        </div>
                    )
                })
            }

        </>
    )
}

export default SpecialShowCase