"use client"

import Loader from "@/components/Loaders/Loader";
import { generateInvoice } from "@/helpers/invoiceGenerator";
import { useUserStore } from "@/store/UserStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CircleCheckBig, MoveRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
    const { data }: any = useUserStore();
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
        <section className="my-6">
            <div className="flex items-center justify-between">
                <h1 className="uppercase font-semibold">Toatal Orders : {totalSellerOrders}</h1>
                <h1>Order Status</h1>
            </div>

            {isPending && <div className="flex items-center justify-center py-5">
                <Loader title="Loading..." />
            </div>}
            {(isError && !isPending) && <div className="flex items-center justify-center py-5">
                <h1>Some Thing Went Wrong</h1>
            </div>}
            {
                (sellerOrders?.data?.length === 0) && <div className="flex items-center justify-center py-5">
                    <h1>No Orders Found</h1>
                </div>
            }
            {
                sellerOrders?.data?.map((order: any) => {
                    return (
                        order?.orders?.map((orderItem: any) => {
                            const { _id, processingStatus } = orderItem;
                            const sellerName = data?.name;
                            return (
                                <div key={_id} className="p-3 border dark:border-neutral-700 rounded my-4 dark:bg-neutral-900/80">
                                    <div className="flex items-center justify-between p-3">
                                        <h1>Order Id : {_id}</h1>
                                        <div className="space-x-2">
                                            <button onClick={() => { generateInvoice(orderItem, sellerName) }} className="py-1 px-2 rounded border dark:border-neutral-700 text-sm">
                                                Generate Invoice</button>
                                            <button className="py-1 px-2 rounded border dark:border-neutral-700 text-sm"
                                                onClick={() => { handelShowDetails(_id) }}
                                            >{showDetails === _id ? "Hide Details" : "Show Details"}</button>
                                        </div>
                                    </div>
                                    <div className={` items-center justify-between flex-grow gap-3 ${showDetails === _id ? "flex" : "hidden"}`}>
                                        <div className="w-full p-3 border dark:border-neutral-700 rounded relative">
                                            <h1 className="text-center">Order Confirmed</h1>
                                            <div className="absolute -right-2 -top-3">
                                                <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" />
                                            </div>
                                        </div>
                                        <MoveRight className="w-20 h-20" />

                                        <div className="w-full p-3 border dark:border-neutral-700 rounded relative">
                                            <h1 className="text-center">Order Processing</h1>
                                            <div className="absolute -right-2 -top-3">
                                                {(processingStatus === "Out For Delivery" || processingStatus === "Order Processing" || processingStatus === "Order Shipped") ? <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" /> :
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        handelOrderUpdate(order._id, _id, "Processing");
                                                    }} className="bg-white dark:bg-[#1a1a1a] px-2 border dark:border-neutral-700 rounded text-sm">Processed ?</button>
                                                }
                                            </div>
                                        </div>
                                        <MoveRight className="w-20 h-20" />
                                        <div className="w-full p-3 border dark:border-neutral-700 rounded relative">
                                            <h1 className="text-center">Order Shipped</h1>
                                            <div className="absolute -right-2 -top-3">
                                                {(processingStatus === "Order Shipped" || processingStatus === "Out For Delivery") ? <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" /> :
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        handelOrderUpdate(order._id, _id, "Ship");
                                                    }} className="bg-white dark:bg-[#1a1a1a] px-2 border dark:border-neutral-700 rounded text-sm">Shipped ?</button>
                                                }
                                            </div>
                                        </div>
                                        <MoveRight className="w-20 h-20" />
                                        <div className="w-full p-3 border dark:border-neutral-700 rounded relative">
                                            <h1 className="text-center">Out For Delivery</h1>
                                            <div className="absolute -right-2 -top-3">
                                                {processingStatus === "Out For Delivery" ? <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" /> :
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        handelOrderUpdate(order._id, _id, "Deliver");
                                                    }} className="bg-white dark:bg-[#1a1a1a] px-2 border dark:border-neutral-700 rounded text-sm">Delivered ?</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            )
                        })
                    )

                })
            }

        </section >
    )
}

export default page