"use client"
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const DashBoardStats = ({ sellerId, load, isAdmin }: { sellerId: string, load: boolean, isAdmin: boolean }) => {

    const [totalProducts, setTotalProducts] = useState("");
    const [totalRequest, setTotalRequest] = useState("");


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

    const getSellerRequestNumber = async () => {
        try {
            const response = await axios.get('/api/getSellerRequests')

            if (response.data.data) {
                setTotalRequest(response.data.data.length)
            } else {
                toast.error("Error Fetching Seller Requests");
            }
        } catch (error) {
            toast.error("Error Fetching Seller Requests")
            console.log("Failed to get products", error)
        }
    }

    useEffect(() => {
        getProductNumber();
        getSellerRequestNumber();
    }, [load])


    return (
        <div className={`grid ${isAdmin ? "grid-cols-4" : "grid-cols-3"} text-center my-10 gap-5 dark:text-neutral-800`}>
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
            {isAdmin ? <Link href={'/dashboard/requests'} className='bg-gray-100 min-h-20 rounded-md place-content-center'>
                Seller Requests <span className='text-red-500'>{totalRequest}</span>
            </Link> : ""}
        </div>
    )
}

export default DashBoardStats