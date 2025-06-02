"use client"
import { useUserStore } from '@/store/UserStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const DashBoardStats = ({ sellerId, load, isAdmin }: { sellerId: string, load: boolean, isAdmin: boolean }) => {
    const { data }: any = useUserStore();
    const [totalProducts, setTotalProducts] = useState("");
    const [totalRequest, setTotalRequest] = useState("");
    const id = data?._id;


    async function getSellerOrders() {
        try {
            const response = await axios.get(`/api/getSellerOrders/${id}`);
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching the seller Orders", error);
        }
    }

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


    const { data: sellerOrders = [] } = useQuery({ queryKey: ['sellerOrders'], queryFn: getSellerOrders, refetchOnWindowFocus: false, enabled: !!id });

    return (
        <div className={`grid ${isAdmin ? "grid-cols-4" : "grid-cols-3"} text-center my-10 gap-5 dark:text-neutral-200 `}>
            {/* Total No oF orders */}
            <div className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700'>
                Total Products : <span className='text-red-600'>{totalProducts}</span>
            </div>
            {/* Revenue Generated */}
            <div className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700'>
                Revenue Generated : ₹2000
            </div>
            {/* Stock Availabel */}
            <div className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700'>
                Orders Recieved : <span className='text-red-600'>{sellerOrders[0]?.orders?.length}</span>
            </div>
            {isAdmin ? <Link href={'/dashboard/requests'} className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700'>
                Seller Requests : <span className='text-red-500'>{totalRequest}</span>
            </Link> : ""}
        </div>
    )
}

export default DashBoardStats