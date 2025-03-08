"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const DashBoardStats = ({ sellerId, load }: { sellerId: string, load: boolean }) => {

    const [totalProducts, setTotalProducts] = useState("")


    useEffect(() => {
        console.log("Seller id is", sellerId)
        const getProductNumber = async () => {
            try {
                const response = await axios.post('/api/getSellerProducts', { sellerId })

                if (response.data.data) {
                    setTotalProducts(response.data.data.length);
                    console.log(totalProducts);
                } else {
                    toast.error("Error Calculating the number of products")
                }
            } catch (error) {
                toast.error("Error Calculating the number of products")
                console.log("Failed to get products", error)
            }
        }

        getProductNumber();
    }, [load])


    return (
        <div className='grid grid-cols-3 text-center my-10 gap-5 dark:text-neutral-800'>
            {/* Total No oF orders */}
            <div className='bg-gray-100 min-h-20 rounded-md place-content-center'>
                Total Products : {totalProducts}
            </div>
            {/* Revenue Generated */}
            <div className='bg-gray-100 min-h-20 rounded-md place-content-center'>
                Revenue Generated : ₹2000
            </div>
            {/* Stock Availabel */}
            <div className='bg-gray-100 min-h-20 rounded-md place-content-center'>
                Available Items 2
            </div>
        </div>
    )
}

export default DashBoardStats