"use client";

import { Package, CreditCard, MapPin, CheckCircle, Clock, Truck, XCircle, BadgeCheck, PackageOpen, Search, Pin, Split, AlertCircle } from 'lucide-react';
import { userProps } from '@/interfaces/commonInterfaces';
import { useUserStore } from '@/store/UserStore';
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
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
            case 'Order Processing':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50';
            case 'Order Shipped':
                return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50';
            case 'Order Cancelled':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800/50';
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
        <div className="min-h-screen pb-24 md:pb-8">
            <div className="container mx-auto px-4 py-4 md:py-8 ">
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4 sm:my-6'>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Track Your Orders</div>
                    <div className="relative w-full sm:w-auto min-w-[280px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search your orders..."
                            className="block w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow text-base sm:text-sm min-h-[44px]"
                        />
                    </div>
                </div>
                {isPending && <NewOrdersSkeleton />}

                {isError && (
                    <div className="p-6 text-center bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/20 dark:border-red-800">
                        <AlertCircle className="w-12 h-12 mx-auto text-red-500 dark:text-red-400" />
                        <h2 className="mt-3 text-lg sm:text-xl font-medium text-red-700 dark:text-red-300">Something Went Wrong</h2>
                        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-neutral-300">
                            We couldn't load your orders. Please try again later.
                        </p>
                    </div>
                )}

                {(!isPending && !isError) && myOrders?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 border-2 border-dashed rounded-xl border-gray-200 dark:border-neutral-700 bg-gray-50/50 dark:bg-neutral-800/20">
                        <PackageOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-neutral-500" />
                        <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900 dark:text-white">No Orders Found</h3>
                        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-neutral-400 max-w-md text-center px-4">
                            You haven't placed any orders yet. Start shopping to see your orders here.
                        </p>
                    </div>
                )}
                <div className="space-y-4 sm:space-y-6">
                    {myOrders[0]?.orders
                        ?.slice()
                        .sort((a: myOrdersProps, b: myOrdersProps) =>
                            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
                        )
                        .map(({ _id, orderName, orderImage, orderPrice, orderDiscount, deliveryAddress, pinCode, processingStatus, paymentStatus, orderQuantity, paymentMethod, orderDate }: myOrdersProps) => (
                            <div key={_id} className="bg-white dark:bg-neutral-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
                                {/* Order Header */}
                                <div className="border-b border-gray-100 dark:border-neutral-700/80 px-4 sm:px-6 py-4 bg-gray-50/50 dark:bg-neutral-800/80 flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="flex justify-between sm:block">
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Order Placed</p>
                                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{formatDate(orderDate)}</p>
                                    </div>
                                    <div className="flex justify-between sm:block sm:place-items-center">
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total</p>
                                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                                            ₹{((orderPrice - orderDiscount) * orderQuantity).toFixed(2)}
                                            {orderDiscount > 0 && (
                                                <span className="block sm:inline sm:ml-2 text-[10px] sm:text-xs text-green-600 dark:text-green-400 text-right sm:text-left">
                                                    (Saved ₹{((orderPrice * orderQuantity) - ((orderPrice - orderDiscount) * orderQuantity)).toFixed(2)})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:place-items-end pt-3 border-t border-gray-200 dark:border-neutral-700 sm:border-0 sm:pt-0">
                                        <div className="flex justify-between sm:block sm:text-right">
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Order Id</p>
                                            <p className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm uppercase tracking-wide">{_id}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row gap-5">
                                        {/* Order Image and Details */}
                                        <div className="flex flex-1 gap-4">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-neutral-700/50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-neutral-700/50">
                                                <Image
                                                    height={200}
                                                    width={200}
                                                    src={orderImage}
                                                    alt={orderName}
                                                    sizes="(max-width: 640px) 80px, 96px"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h3 className="font-medium text-base sm:text-lg text-gray-900 dark:text-white capitalize line-clamp-2 leading-snug">{orderName}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1.5 sm:mt-2">
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Qty: {orderQuantity}</p>
                                                    <span className="hidden sm:inline text-gray-300 dark:text-neutral-600">•</span>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        ₹{orderPrice.toFixed(2)} each
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Status and Actions */}
                                        <div className="flex flex-col items-start sm:items-end space-y-2.5 sm:min-w-[180px]">
                                            <div className="w-full sm:w-auto">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full font-medium text-xs sm:text-sm border ${getStatusStyles(processingStatus)}`}>
                                                    {getStatusIcon(processingStatus)}
                                                    {processingStatus}
                                                </span>
                                            </div>
                                            <div className="w-full sm:w-auto">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full font-medium text-xs sm:text-sm border ${paymentStatus === 'Done'
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50'
                                                    }`}>
                                                    {paymentStatus === 'Done' ? <CheckCircle className="mr-1.5 w-3 h-3 sm:w-4 sm:h-4" /> : <Clock className="mr-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                    {paymentStatus}
                                                </span>
                                            </div>
                                            <button className="w-full sm:w-auto sm:min-h-0 mt-3 sm:mt-1 px-4 sm:px-3 py-2 sm:py-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg sm:rounded-md border border-blue-200 dark:border-blue-800/50 font-medium text-sm flex items-center justify-center transition-colors">
                                                <Split className="mr-2 w-4 h-4" /> Track Package
                                            </button>
                                        </div>
                                    </div>

                                    {/* Delivery Information */}
                                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-neutral-700">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4">
                                            <div className="w-full">
                                                <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center">
                                                    <MapPin className="mr-1.5 w-4 h-4 text-gray-400" /> Delivery Address
                                                </h4>
                                                <p className="text-gray-900 dark:text-gray-200 text-sm leading-relaxed">{deliveryAddress}</p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">PIN: {pinCode}</p>
                                            </div>
                                            <div className="w-full sm:place-items-center border-t border-gray-100 dark:border-neutral-800 pt-4 sm:pt-0 sm:border-0">
                                                <div className="sm:text-center">
                                                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center sm:justify-center">
                                                        <CreditCard className="mr-1.5 w-4 h-4 text-gray-400" /> Payment Method
                                                    </h4>
                                                    <p className="text-gray-900 dark:text-gray-200 text-sm font-medium">{paymentMethod === "COD" ? "Cash on Delivery" : "Online Paid"}</p>
                                                </div>
                                            </div>
                                            <div className="w-full sm:place-items-end border-t border-gray-100 dark:border-neutral-800 pt-4 sm:pt-0 sm:border-0">
                                                <div className="sm:text-right">
                                                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center sm:justify-end">
                                                        <Pin className="mr-1.5 w-4 h-4 text-gray-400" /> Estimated Delivery
                                                    </h4>
                                                    <p className="text-gray-900 dark:text-gray-200 text-sm font-medium">{formatDate(orderDate)}</p>
                                                </div>
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