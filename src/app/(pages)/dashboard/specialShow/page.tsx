"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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
            <div className='grid grid-cols-9 place-items-center'>
                <div className='col-span-2'>Name</div>
                <div className='col-span-3'>Images</div>
                <div className='col-span-1'>MRP</div>
                <div className='col-span-1'>Discount</div>
                <div className='col-span-1'>Prod_id</div>
                <div className='col-span-1'>Seller</div>
            </div>
            {
                data.map(({ _id, prodName, prodPrice, prodImages, prodDiscount, productId, requestedBy }) => {
                    return (
                        <div key={_id} className='flex items-center justify-center gap-3 w-full'>
                            <div>
                                <label >Name</label>
                                <h1>{prodName}</h1>
                            </div>

                            <div>
                                {prodPrice}
                            </div>

                            {/* {prodImages} */}
                            <div>
                                {prodDiscount}
                            </div>

                            <div>
                                {productId}
                            </div>

                            <div>
                                {requestedBy}
                            </div>
                        </div>
                    )
                })
            }

        </>
    )
}

export default SpecialShowCase