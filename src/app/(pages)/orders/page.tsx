"use client"
import Loader from '@/components/Loaders/Loader';
import { userProps } from '@/interfaces/commonInterfaces';
import { useUserStore } from '@/store/UserStore'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Circle, LoaderCircle, MapPin, Package, PackageOpen, Search, Tag, XCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'

interface myOrdersProps {
    _id: string,
    orderName: string,
    orderImage: string,
    orderPrice: number,
    orderDiscount: number,
    deliveryAddress: string,
    pinCode: string,
    processingStatus: string,
    paymentStatus: string,
    orderQuantity: number
}

const page = () => {
    const { data }: { data: userProps } = useUserStore();

    async function getMyOrders() {
        const userId = data?._id
        try {
            const response = await axios.get(`/api/getOrders/${userId}`);
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error fetching the user orders: ", error);
            return [];
        }
    }

    const { data: myOrders = [], isPending, isError } = useQuery({
        queryKey: ['myOrders'],
        queryFn: getMyOrders,
        enabled: !!data?._id,
        refetchOnWindowFocus: false
    })

    return (
        <section className="py-4">
            {/* Search Section */}
            <div className="relative mb-8 w-full">
                <div className="flex rounded overflow-hidden shadow-sm">
                    <input
                        type="search"
                        className="flex-1 p-2 text-gray-700 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white placeholder:text-sm"
                        placeholder="Search your orders by product, order ID, or status..."
                    />
                    <button className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors">
                        <Search className="w-5 h-5" />
                        <span className="hidden sm:inline">Search Orders</span>
                    </button>
                </div>
            </div>

            {/* Loading & Error States */}
            {isPending && (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl">
                    <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
                    <p className="mt-4 text-lg font-medium text-gray-600 dark:text-neutral-300">Loading your orders...</p>
                </div>
            )}

            {isError && (
                <div className="p-6 text-center bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/20 dark:border-red-800">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 dark:text-red-400" />
                    <h2 className="mt-3 text-xl font-medium text-red-700 dark:text-red-300">Something Went Wrong</h2>
                    <p className="mt-2 text-gray-600 dark:text-neutral-300">
                        We couldn't load your orders. Please try again later.
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!isPending && !isError && myOrders?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl dark:border-neutral-700">
                    <PackageOpen className="w-16 h-16 text-gray-400 dark:text-neutral-500" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">No Orders Found</h3>
                    <p className="mt-2 text-gray-600 dark:text-neutral-400 max-w-md text-center">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                    </p>
                </div>
            )}

            {/* Orders Grid */}
            <div className="grid gap-5">
                {myOrders[0]?.orders?.map(({ _id, orderName, orderImage, orderPrice, orderDiscount, deliveryAddress, pinCode, processingStatus, paymentStatus, orderQuantity }: myOrdersProps) => (
                    <div key={_id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900/40 dark:border-neutral-800">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr]">
                            {/* Product Information */}
                            <div className="flex items-start gap-4 p-5 border-b md:border-b-0 md:border-r border-gray-200 dark:border-neutral-800">
                                <div className="flex-shrink-0">
                                    <div className="relative w-20 h-20 overflow-hidden border rounded-lg dark:border-neutral-700">
                                        <Image
                                            src={orderImage || '/placeholder.svg'}
                                            alt={orderName}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium line-clamp-2 text-gray-900 dark:text-white">{orderName}</h3>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-neutral-400">
                                            <Package className="w-4 h-4" />
                                            <span>Qty: {orderQuantity}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-neutral-400">
                                            <Tag className="w-4 h-4" />
                                            <span>ID: {_id.slice(0, 8)}...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Information */}
                            <div className="grid grid-cols-3 p-5 border-b md:border-b-0 md:border-r border-gray-200 dark:border-neutral-800">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 dark:text-neutral-400">MRP</p>
                                    <p className="font-medium text-gray-900 dark:text-white">₹{orderPrice?.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 dark:text-neutral-400">Discount</p>
                                    <p className="font-medium text-green-600 dark:text-green-400">-₹{orderDiscount?.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 dark:text-neutral-400">Total</p>
                                    <p className="font-medium text-blue-600 dark:text-blue-400">₹{(orderPrice - orderDiscount)?.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Delivery & Status */}
                            <div className="p-5">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <div className="flex items-start gap-2 mb-1">
                                            <MapPin className="w-5 h-5 text-gray-500 dark:text-neutral-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-neutral-400">Delivery Address</p>
                                                <p className="text-gray-900 line-clamp-2 dark:text-white">{deliveryAddress}</p>
                                                <p className="text-sm text-gray-600 dark:text-neutral-300">📌 {pinCode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-neutral-400">Order Status</p>
                                                <div className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-medium ${processingStatus === 'Delivered'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : processingStatus === 'Processing'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}>
                                                    <Circle className="w-2 h-2 fill-current" />
                                                    <span>{processingStatus}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-neutral-400">Payment</p>
                                                <div className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStatus === 'Paid'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {paymentStatus === 'Paid' ? (
                                                        <CheckCircle className="w-3 h-3 fill-current" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 fill-current" />
                                                    )}
                                                    <span>{paymentStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default page