"use client"
import { useUserStore } from '@/store/UserStore';
import { useQuery } from '@tanstack/react-query';
import { BringToFront, CircleCheck, Gem, HandCoins, Landmark, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import toast from 'react-hot-toast';
import StatsSkeleton from '../Skeletons/Dashboard/StatsSkeleton';
import ApiClient from '@/interceptors/ApiClient';

const DashBoardStats = ({ sellerId, isAdmin }: { sellerId: string, isAdmin: boolean, kycVerified: string }) => {
    const { data }: any = useUserStore();
    const id = data?._id;

    async function getSellerOrders() {
        try {
            const response = await ApiClient.get(`/api/getSellerOrders/${id}`);
            if (response.data.total) return response.data.total || 0;
            return 0;
        } catch (error) {
            console.error("Error fetching the seller Orders", error);
        }
    }

    const getProductNumber = async () => {
        try {
            const response = await ApiClient.post('/api/getSellerProducts', { sellerId });
            if (response.data.data) return response.data?.totalCount || 0;
            else toast.error("Error Calculating the number of products");
        } catch (error) {
            toast.error("Error Calculating the number of products");
        }
    }

    const getSellerRequestNumber = async () => {
        try {
            const response = await ApiClient.get('/api/getSellerRequests');
            if (response.data?.data) return response.data?.data.length || 0;
            return 0;
        } catch (error) {
            toast.error("Error Fetching Seller Requests");
            return 0;
        }
    }

    async function getSellerDetails() {
        try {
            const response = await ApiClient.get(`/api/getSelletDetails/${id}`);
            if (!response.data?.data) return [];
            return response.data.data;
        } catch (error) {
            console.error('Failed to get the seller details : ', error);
        }
    }

    const { data: totalProductsNumber = 0, isLoading } = useQuery({ queryKey: ['totalProductsNumber'], queryFn: getProductNumber, refetchOnWindowFocus: false, enabled: !!id });
    const { data: totalRequestNumber = 0 } = useQuery({ queryKey: ['totalRequestNumber'], queryFn: getSellerRequestNumber, refetchOnWindowFocus: false, enabled: !!id });
    const { data: sellerOrders = 0, isPending } = useQuery({ queryKey: ['sellerOrders'], queryFn: getSellerOrders, refetchOnWindowFocus: false, enabled: !!id });
    const { data: sellerDetails = [], isFetching, isError } = useQuery({ queryFn: getSellerDetails, queryKey: ['sellerDetails'], refetchOnWindowFocus: false, enabled: !!id });

    const kycVerified = sellerDetails?.bankDetails?.status === "Verified";

    if (isLoading || isPending || isFetching) return <StatsSkeleton isAdmin={isAdmin} />;
    if (isError) return null;

    return (
        <div>

            {/* ── MOBILE: horizontal compact rows ── */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">

                {/* Products */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex-shrink-0">
                        <PackageSearch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium leading-none mb-0.5">Products</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">{totalProductsNumber}</p>
                    </div>
                </div>

                {/* Orders */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 flex-shrink-0">
                        <BringToFront className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium leading-none mb-0.5">Orders</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">{sellerOrders > 0 ? sellerOrders : 0}</p>
                    </div>
                </div>

                {/* Revenue */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex-shrink-0">
                        <HandCoins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium leading-none mb-0.5">Revenue</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">₹2000</p>
                    </div>
                </div>

                {/* KYC */}
                <Link href="/dashboard/kyc-details" className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm relative overflow-hidden">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex-shrink-0">
                        <Landmark className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium leading-none mb-0.5">KYC</p>
                        <p className={`text-sm font-bold leading-none ${kycVerified ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {kycVerified ? "Verified" : "Pending"}
                        </p>
                    </div>
                    {kycVerified && (
                        <CircleCheck className="w-3.5 h-3.5 text-green-500 absolute top-1.5 right-1.5" />
                    )}
                </Link>

                {/* Admin: Seller Requests — full width */}
                {isAdmin && (
                    <Link href="/dashboard/requests" className="col-span-2 flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm">
                        <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex-shrink-0">
                            <Gem className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-medium leading-none mb-0.5">Seller Requests</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">{totalRequestNumber}</p>
                        </div>
                    </Link>
                )}
            </div>

            {/* ── DESKTOP: original vertical cards ── */}
            <div className={`hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 ${isAdmin ? "xl:grid-cols-5" : ""} gap-6`}>

                <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-blue-100/80 dark:bg-blue-900/30 group-hover:bg-blue-200/80 dark:group-hover:bg-blue-800/50 transition-all duration-300'>
                            <PackageSearch className='size-6 text-blue-600 dark:text-blue-400' />
                        </div>
                        <p className='text-sm text-gray-500 dark:text-neutral-400 font-medium text-center'>Total Products</p>
                        <p className='text-2xl font-bold text-gray-800 dark:text-white'>{totalProductsNumber}</p>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-green-100/80 dark:bg-green-900/30 group-hover:bg-green-200/80 dark:group-hover:bg-green-800/50 transition-all duration-300'>
                            <BringToFront className='size-6 text-green-600 dark:text-green-400' />
                        </div>
                        <p className='text-sm text-gray-500 dark:text-neutral-400 font-medium text-center'>Orders Received</p>
                        <p className='text-2xl font-bold text-gray-800 dark:text-white'>{sellerOrders > 0 ? sellerOrders : 0}</p>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-amber-100/80 dark:bg-amber-900/30 group-hover:bg-amber-200/80 dark:group-hover:bg-amber-800/50 transition-all duration-300'>
                            <HandCoins className='size-6 text-amber-600 dark:text-amber-400' />
                        </div>
                        <p className='text-sm text-gray-500 dark:text-neutral-400 font-medium text-center'>Est. Revenue</p>
                        <p className='text-2xl font-bold text-gray-800 dark:text-white'>₹2000</p>
                    </div>
                </div>

                <Link href='/dashboard/kyc-details' className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 relative'>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <div className='p-3 rounded-full bg-purple-100/80 dark:bg-purple-900/30 group-hover:bg-purple-200/80 dark:group-hover:bg-purple-800/50 transition-all duration-300'>
                            <Landmark className='size-6 text-purple-600 dark:text-purple-400' />
                        </div>
                        <p className='text-sm text-gray-500 dark:text-neutral-400 font-medium text-center'>KYC Status</p>
                        <p className={`text-2xl font-bold ${kycVerified ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {kycVerified ? "Verified" : "Pending"}
                        </p>
                    </div>
                    {kycVerified && (
                        <div className="absolute -top-2 -right-4 px-2 text-green-500">
                            <CircleCheck className='w-7 h-7 bg-white dark:bg-neutral-700 rounded-full' />
                        </div>
                    )}
                </Link>

                {isAdmin && (
                    <Link href='/dashboard/requests' className='bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-all duration-300 group hover:-translate-y-1'>
                        <div className='flex flex-col items-center justify-center gap-3'>
                            <div className='p-3 rounded-full bg-pink-100/80 dark:bg-pink-900/30 group-hover:bg-pink-200/80 dark:group-hover:bg-pink-800/50 transition-all duration-300'>
                                <Gem className='size-6 text-pink-600 dark:text-pink-400' />
                            </div>
                            <p className='text-sm text-gray-500 dark:text-neutral-400 font-medium text-center'>Seller Requests</p>
                            <p className='text-2xl font-bold text-gray-800 dark:text-white'>{totalRequestNumber}</p>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default DashBoardStats;