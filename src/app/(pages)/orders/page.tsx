"use client";
import React from 'react';
import { Package, CreditCard, MapPin, CheckCircle, Clock, Truck, XCircle, BadgeCheck, PackageOpen, Search, Pin, Split, AlertCircle } from 'lucide-react';
import { userProps } from '@/interfaces/commonInterfaces';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import NewOrdersSkeleton from '@/components/Skeletons/Orders/NewOrdersSkeleton';
import ApiClient from '@/interceptors/ApiClient';

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
    orderQuantity: number,
    paymentMethod: string,
    orderDate: string
}

// Example usage with sample data
const page = () => {
    const { data }: { data: userProps } = useUserStore();

    // Helper function to format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Helper function to determine status styling
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Out For Delivery':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
            case 'Order Processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
            case 'Order Shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
            case 'Order Cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
        }
    };

    // Helper function to get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Order Confirmed':
                return <BadgeCheck className="mr-1 w-4 h-4" />;
            case 'Out For Delivery':
                return <CheckCircle className="mr-1 w-4 h-4" />;
            case 'Order Processing':
                return <Clock className="mr-1 w-4 h-4" />;
            case 'Order Shipped':
                return <Truck className="mr-1 w-4 h-4" />;
            case 'Order Cancelled':
                return <XCircle className="mr-1 w-4 h-4" />;
            default:
                return <Package className="mr-1 w-4 h-4" />;
        }
    };

    async function getMyOrders() {
        const userId = data?._id
        try {
            const response = await ApiClient.get(`/api/getOrders/${userId}`);
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
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-4">
                <div className='flex items-center justify-between my-6'>
                    <div className="text-3xl font-bold text-gray-800 dark:text-white">Track Your Orders</div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search your orders..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                        />
                    </div>
                </div>
                {isPending && <NewOrdersSkeleton />}

                {isError && (
                    <div className="p-6 text-center bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/20 dark:border-red-800">
                        <AlertCircle className="w-12 h-12 mx-auto text-red-500 dark:text-red-400" />
                        <h2 className="mt-3 text-xl font-medium text-red-700 dark:text-red-300">Something Went Wrong</h2>
                        <p className="mt-2 text-gray-600 dark:text-neutral-300">
                            We couldn't load your orders. Please try again later.
                        </p>
                    </div>
                )}

                {(!isPending && !isError) && myOrders?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl dark:border-neutral-700">
                        <PackageOpen className="w-16 h-16 text-gray-400 dark:text-neutral-500" />
                        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">No Orders Found</h3>
                        <p className="mt-2 text-gray-600 dark:text-neutral-400 max-w-md text-center">
                            You haven't placed any orders yet. Start shopping to see your orders here.
                        </p>
                    </div>
                )}
                <div className="space-y-6">
                    {myOrders[0]?.orders?.map(({ _id, orderName, orderImage, orderPrice, orderDiscount, deliveryAddress, pinCode, processingStatus, paymentStatus, orderQuantity, paymentMethod, orderDate }: myOrdersProps) => (
                        <div key={_id} className="bg-white dark:bg-neutral-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
                            {/* Order Header */}
                            <div className="border-b border-gray-200 dark:border-neutral-700 px-6 py-4 grid grid-cols-3 gap-4 ">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Placed</p>
                                    <p className="font-medium text-sm dark:text-white">{formatDate(orderDate)}</p>
                                </div>
                                <div className="mb-2 sm:mb-0 place-items-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                    <p className="font-medium dark:text-white">
                                        ₹{((orderPrice - orderDiscount) * orderQuantity).toFixed(2)}
                                        {orderDiscount > 0 && (
                                            <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                                                (Saved ₹{((orderPrice * orderQuantity) - ((orderPrice - orderDiscount) * orderQuantity)).toFixed(2)})
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="mb-2 sm:mb-0 place-items-end">
                                    <div className='w-fit'>
                                        <p className="text-sm text-gray-500 dark:text-gray-400"># Order Id</p>
                                        <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{_id.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row">
                                    {/* Order Image and Details */}
                                    <div className="flex flex-1 mb-4 md:mb-0">
                                        <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-700 rounded-md overflow-hidden flex-shrink-0">
                                            <Image
                                                height={1000}
                                                width={1000}
                                                src={orderImage}
                                                alt={orderName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-medium text-gray-800 dark:text-white capitalize">{orderName}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">Quantity: {orderQuantity}</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                Price: ₹{orderPrice.toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Status and Actions */}
                                    <div className="flex flex-col items-start md:items-end">
                                        <div className="flex items-center mb-2 text-xs">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${getStatusStyles(processingStatus)} `}>
                                                Delivery Status : &nbsp;{getStatusIcon(processingStatus)}
                                                {processingStatus}
                                            </span>
                                        </div>
                                        <div className="mb-2 text-xs">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${paymentStatus === 'Done'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                                }`}>
                                                Payment Status : &nbsp;{paymentStatus === 'Done' ? <CheckCircle className="mr-1 w-4 h-4" /> : <Clock className="mr-1 w-4 h-4" />}
                                                {paymentStatus}
                                            </span>
                                        </div>
                                        <button className="px-3 py-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm mt-1 flex items-center justify-center">
                                            <Split className="mr-1 w-4 h-4" /> Track Package
                                        </button>
                                    </div>
                                </div>

                                {/* Delivery Information */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                                    <div className="grid grid-cols-3 gap-4 ">
                                        <div className="w-full mb-4 md:mb-0">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                                                <MapPin className="mr-2 w-4 h-4" /> Delivery Address
                                            </h4>
                                            <p className="text-gray-800 dark:text-gray-200 text-sm">{deliveryAddress}</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">PIN: {pinCode}</p>
                                        </div>
                                        <div className="w-full place-items-center">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                                                <CreditCard className="mr-2 w-4 h-4" /> Payment Method
                                            </h4>
                                            <p className="text-gray-800 dark:text-gray-200 text-sm">{paymentMethod === "COD" ? "Cash on Delivery" : "Online"}</p>
                                        </div>
                                        <div className="w-full place-items-end">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                                                <Pin className="mr-2 w-4 h-4" /> Delivery Date
                                            </h4>
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{formatDate(orderDate)}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default page;