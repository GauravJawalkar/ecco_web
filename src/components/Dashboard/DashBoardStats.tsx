"use client"
import { useUserStore } from '@/store/UserStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BringToFront, CircleCheck, Gem, HandCoins, Landmark, Loader2, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import StatsSkeleton from '../Skeletons/Dashboard/StatsSkeleton';

const DashBoardStats = ({ sellerId, isAdmin, kycVerified }: { sellerId: string, isAdmin: boolean, kycVerified: string }) => {
    const { data }: any = useUserStore();
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

    const { data: totalProductsNumber = [], isLoading } = useQuery({ queryKey: ['totalProductsNumber'], queryFn: getProductNumber, refetchOnWindowFocus: false, enabled: !!id });

    const { data: totalRequestNumber = [] } = useQuery({ queryKey: ['totalRequestNumber'], queryFn: getSellerRequestNumber, refetchOnWindowFocus: false, enabled: !!id });


    const { data: sellerOrders = [], isPending } = useQuery({ queryKey: ['sellerOrders'], queryFn: getSellerOrders, refetchOnWindowFocus: false, enabled: !!id });

    const { data: sellerDetails = [], isFetching, isError } = useQuery({ queryFn: getSellerDetails, queryKey: ['sellerDetails'], refetchOnWindowFocus: false, enabled: !!id })

    return (
        <>
            {(isLoading || isPending || isFetching) && (<StatsSkeleton isAdmin={isAdmin} />)}
            {(!isError && (!isLoading && !isPending && !isFetching)) && <div className={`grid ${isAdmin ? "grid-cols-5" : "grid-cols-4"} gap-6 my-8`}>
                {/* Total Products */}
                <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-blue-100/80 dark:bg-blue-900/30 group-hover:bg-blue-200/80 dark:group-hover:bg-blue-800/50 transition-all duration-300'>
                            <PackageSearch className='size-6 text-blue-600 dark:text-blue-400' />
                        </div>
                        <p className='text-gray-500 dark:text-neutral-400 font-medium'>Total Products</p>
                        <p className='text-2xl font-bold text-gray-800 dark:text-white'>{totalProductsNumber}</p>
                    </div>
                </div>

                {/* Orders Received */}
                <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-green-100/80 dark:bg-green-900/30 group-hover:bg-green-200/80 dark:group-hover:bg-green-800/50 transition-all duration-300'>
                            <BringToFront className='size-6 text-green-600 dark:text-green-400' />
                        </div>
                        <p className='text-gray-500 dark:text-neutral-400 font-medium'>Orders Received</p>
                        <p className='text-2xl font-bold text-gray-800 dark:text-white'>{sellerOrders > 0 ? sellerOrders : 0}</p>
                    </div>
                </div>

                {/* Estimated Revenue */}
                <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-amber-100/80 dark:bg-amber-900/30 group-hover:bg-amber-200/80 dark:group-hover:bg-amber-800/50 transition-all duration-300'>
                            <HandCoins className='size-6 text-amber-600 dark:text-amber-400' />
                        </div>
                        <p className='text-gray-500 dark:text-neutral-400 font-medium'>Estimated Revenue</p>
                        <p className='text-2xl font-bold text-gray-800 dark:text-white'>₹2000</p>
                    </div>
                </div>

                {/* KYC Status */}
                <Link href={'/dashboard/kyc-details'} className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 relative'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-purple-100/80 dark:bg-purple-900/30 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-800/50 transition-all duration-300'>
                            <Landmark className='size-6 text-purple-600 dark:text-purple-400' />
                        </div>
                        <p className='text-gray-500 dark:text-neutral-400 font-medium'>KYC Status</p>
                        <p className={`text-2xl font-bold ${sellerDetails?.bankDetails?.status === "Verified" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {sellerDetails?.bankDetails?.status === "Verified" ? "Verified" : "Pending"}
                        </p>
                    </div>
                    {sellerDetails?.bankDetails?.status === "Verified" && <div className={`absolute -top-2 -right-4 px-2 text-green-500 rounded-tr-xl rounded-bl-xl`}>
                        <CircleCheck className='w-7 h-7 bg-white dark:bg-neutral-700 rounded-full' />
                    </div>}
                </Link>

                {/* Seller Requests (Admin Only) */}
                {isAdmin && (
                    <Link href={'/dashboard/requests'} className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group hover:-translate-y-1'>
                        <div className='flex flex-col items-center justify-center gap-3'>
                            <div className='p-3 rounded-full bg-pink-100/80 dark:bg-pink-900/30 group-hover:bg-pink-200/80 dark:group-hover:bg-pink-800/50 transition-all duration-300'>
                                <Gem className='size-6 text-pink-600 dark:text-pink-400' />
                            </div>
                            <p className='text-gray-500 dark:text-neutral-400 font-medium'>Seller Requests</p>
                            <p className='text-2xl font-bold text-gray-800 dark:text-white'>{totalRequestNumber}</p>
                        </div>
                    </Link>
                )}
            </div>}

        </>
    )
}

export default DashBoardStats