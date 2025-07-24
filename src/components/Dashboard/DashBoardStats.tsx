"use client"
import { useUserStore } from '@/store/UserStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BringToFront, Gem, HandCoins, Landmark, Loader2, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const DashBoardStats = ({ sellerId, isAdmin, kycVerified }: { sellerId: string, isAdmin: boolean, kycVerified: string }) => {
    const { data }: any = useUserStore();
    const [totalProducts, setTotalProducts] = useState("");
    const [totalRequest, setTotalRequest] = useState("");
    const id = data?._id;

    async function getSellerOrders() {
        try {
            const response = await axios.get(`/api/getSellerOrders/${id}`);
            if (response.data.total) {
                return response.data.total || 0;
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
                return response.data?.totalCount || 0;
            } else {
                toast.error("Error Calculating the number of products")
            }
        } catch (error) {
            toast.error("Error Calculating the number of products")
        }
    }

    const getSellerRequestNumber = async () => {
        try {
            const response = await axios.get('/api/getSellerRequests')

            if (response.data.data) {
                return response.data.data.length || 0;
            } else {
                toast.error("Error Fetching Seller Requests");
            }
        } catch (error) {
            console.error("Failed to get products", error);
            toast.error("Error Fetching Seller Requests")
        }
    }

    async function getSellerDetails() {
        try {
            const response = await axios.get(`/api/getSelletDetails/${id}`);
            if (!response.data.data) {
                return [];
            }
            return response.data.data
        } catch (error) {
            console.error('Failed to get the seller details : ', error)
        }
    }

    const { data: totalProductsNumber = [] } = useQuery({ queryKey: ['totalProductsNumber'], queryFn: getProductNumber, refetchOnWindowFocus: false, enabled: !!id });

    const { data: totalRequestNumber = [] } = useQuery({ queryKey: ['totalRequestNumber'], queryFn: getSellerRequestNumber, refetchOnWindowFocus: false, enabled: !!id });


    const { data: sellerOrders = [] } = useQuery({ queryKey: ['sellerOrders'], queryFn: getSellerOrders, refetchOnWindowFocus: false, enabled: !!id });

    const { data: sellerDetails = [] } = useQuery({ queryFn: getSellerDetails, queryKey: ['sellerDetails'], refetchOnWindowFocus: false, enabled: !!id })

    return (
        <div className={`grid ${isAdmin ? "grid-cols-5" : "grid-cols-4"} text-center mt-10 mb-5 gap-5 dark:text-neutral-200 `} >
            {/* Total No oF orders */}
            <div className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700 flex gap-2 items-center justify-center' >
                <PackageSearch className='size-6' /> Total Products : <span className='text-red-600'>{totalProductsNumber}</span>
            </div >
            {/* Stock Availabel */}
            <div className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700 flex gap-2 items-center justify-center' >
                <BringToFront className='size-6' /> Orders Recieved: <span className='text-red-600'>{sellerOrders > 0 ? sellerOrders : 0}</span>
            </div>
            {/* Revenue Generated */}
            <div className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700 flex gap-2 items-center justify-center' >
                <HandCoins className='size-6' /> Estimated: ₹2000
            </div>
            {/* KYC Status For RazorPay */}
            <Link href={'/dashboard/kyc-details'} className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center gap-2' >
                <Landmark className='size-6' /> KYC: <span className='text-red-600'>{sellerDetails?.bankDetails?.status === "Verified" ? "Verified" : "Pending"}</span>
            </Link>
            {
                isAdmin ? <Link href={'/dashboard/requests'} className='border min-h-20 rounded-md place-content-center dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center gap-2'>
                    < Gem className='size-6' /> Seller Requests: <span className='text-red-500'>{totalRequestNumber}</span>
                </Link > : ""
            }
        </div >
    )
}

export default DashBoardStats