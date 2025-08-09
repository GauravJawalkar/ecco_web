"use client"

import { OrderCard } from "@/components/OrdersProcess/OrderCard";
import { generateInvoice } from "@/helpers/invoiceGenerator";
import { userProps } from "@/interfaces/commonInterfaces";
import { useUserStore } from "@/store/UserStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, Loader2, PackageOpen } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export interface OrderItemType {
    _id: string;
    processingStatus: string;
    orderName: string;
    orderImage: string;
    contactNumber: string;
    pinCode: string;
    paymentMethod: string;
    orderQuantity: string;
    orderPrice: number;
}

const page = () => {
    const { data }: { data: userProps } = useUserStore();
    const [showDetails, setShowDetails] = useState("");
    const id = data?._id;
    const queryClient = useQueryClient();
    const [totalSellerOrders, setTotalSellerOrders] = useState(0);

    async function getSellerOrders() {
        try {
            const response = await axios.get(`/api/getSellerOrders/${id}`);
            if (response.data.data) {
                setTotalSellerOrders(response.data.total || 0);
                return response.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching the seller Orders", error);
        }
    }

    async function updateOrderState({ orderDocId, orderID, processState }: { orderDocId: string, orderID: string, processState: string }) {
        try {
            const response = await axios.put('/api/updateSellerOrderState', { processState, orderID, orderDocId });
            if (response.data.data) {
                return response.data.data || []
            }
            return [];
        } catch (error) {
            console.error("Error updating the order state : ", error);
            return [];
        }
    }

    const updateOrderMutation = useMutation({
        mutationFn: updateOrderState,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellerOrders'] });
            toast.success("Order Status updated");
        }
    })

    const handelOrderUpdate = (orderDocId: string, orderID: string, processState: string) => {
        updateOrderMutation.mutate({ orderDocId, orderID, processState });
    }

    const handelShowDetails = (_id: string) => {
        setShowDetails(prev => (prev === _id ? "" : _id));
    }

    const { data: sellerOrders = [], isPending, isError } = useQuery({ queryKey: ['sellerOrders'], queryFn: getSellerOrders, refetchOnWindowFocus: false, enabled: !!id });

    return (
        <section className="min-h-screen py-8 dark:bg-neutral-900/50">
            <div className="container mx-auto px-4">
                {/* Header Section*/}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
                        Manage Your Orders Here
                        <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-300">
                            ({totalSellerOrders} {totalSellerOrders === 1 ? 'order' : 'orders'})
                        </span>
                    </h1>
                </div>

                {/* Loading State */}
                {
                    isPending && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your orders...</p>
                        </div>
                    )
                }

                {/* Error State */}
                {
                    isError && !isPending && (
                        <div className="flex flex-col items-center justify-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <AlertCircle className="h-10 w-10 text-red-500" />
                            <p className="mt-4 text-red-600 dark:text-red-400 text-center max-w-md">
                                Something went wrong while loading your orders. Please try again later.
                            </p>
                            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                Retry
                            </button>
                        </div>
                    )
                }

                {/* Empty State */}
                {
                    sellerOrders?.data?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                            <PackageOpen className="h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600 dark:text-gray-400">No orders found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                Your orders will appear here once you receive them
                            </p>
                        </div>
                    )
                }

                {/* Orders List */}
                <div className="space-y-6">
                    {sellerOrders?.data?.map((order: any) =>
                        order?.orders?.map((orderItem: OrderItemType) => (
                            <OrderCard
                                key={orderItem._id}
                                order={orderItem}
                                sellerName={data?.name}
                                showDetails={showDetails === orderItem._id}
                                onShowDetails={() => handelShowDetails(orderItem._id)}
                                onGenerateInvoice={() => generateInvoice(orderItem, data?.name)}
                                onStatusUpdate={(status) => handelOrderUpdate(order._id, orderItem._id, status)}
                            />
                        ))
                    )}
                </div>
            </div>
        </section >
    )
}

export default page