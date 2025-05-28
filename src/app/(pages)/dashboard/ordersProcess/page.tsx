"use client"

import Loader from "@/components/Loaders/Loader";
import { useUserStore } from "@/store/UserStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CircleCheckBig, MoveRight, Workflow } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
    const { data }: any = useUserStore();
    const [processState, setProcessState] = useState("");
    const [orderID, setOrderID] = useState("");
    const id = data?._id;
    const queryClient = useQueryClient();

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

    async function updateOrderState() {
        try {
            const response = await axios.put('/api/updateSellerOrderState', { processState, orderID });
            if (response.data.data) {
                return response.data.data
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

    const handelOrderUpdate = () => {
        updateOrderMutation.mutate();
    }

    const { data: sellerOrders = [], isPending, isError, isLoading } = useQuery({ queryKey: ['sellerOrders'], queryFn: getSellerOrders, refetchOnWindowFocus: false, enabled: !!id });
    return (
        <section className="my-6">
            <div className="flex items-center justify-between">
                <h1>Toatal Orders : {sellerOrders.length}</h1>
                <h1>Order Processing</h1>
            </div>

            {isPending && <div className="flex items-center justify-center py-5">
                <Loader title="Loading..." />
            </div>}
            {isError && <div className="flex items-center justify-center py-5">
                <h1>Some Thing Went Wrong</h1>
            </div>}
            {
                (!isPending && sellerOrders.length === 0) && <div className="flex items-center justify-center py-5">
                    <h1>No Orders Found</h1>
                </div>
            }
            {
                sellerOrders?.map(({ _id, processingStatus }: { _id: string, processingStatus: string }) => {
                    return (
                        <div key={_id} className="p-3 border dark:border-neutral-700 rounded-lg my-4 dark:bg-neutral-900/80">
                            <div className="flex items-center justify-between p-3">
                                <h1>Order Id : {_id}</h1>
                                <button>Show Details</button>
                            </div>
                            <div className="flex items-center justify-between flex-grow gap-3">
                                <div className="w-full p-3 border dark:border-neutral-700 rounded-xl relative">
                                    <h1 className="text-center">Order Confirmed</h1>
                                    <div className="absolute -right-2 -top-3">
                                        <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" />
                                    </div>
                                </div>
                                <MoveRight className="w-20 h-20" />

                                <div className="w-full p-3 border dark:border-neutral-700 rounded-xl relative">
                                    <h1 className="text-center">Order Processing</h1>
                                    <div className="absolute -right-2 -top-3">
                                        {(processingStatus === "Out For Delivery" || processingStatus === "Order Processing" || processingStatus === "Order Shipped") ? <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" /> :
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                setOrderID(_id); setProcessState("Processing");
                                                handelOrderUpdate();
                                            }} className="bg-white dark:bg-[#1a1a1a] px-2 border dark:border-neutral-700 rounded text-sm">Process ?</button>
                                        }
                                    </div>
                                </div>
                                <MoveRight className="w-20 h-20" />
                                <div className="w-full p-3 border dark:border-neutral-700 rounded-xl relative">
                                    <h1 className="text-center">Order Shipped</h1>
                                    <div className="absolute -right-2 -top-3">
                                        {(processingStatus === "Order Shipped" || processingStatus === "Out For Delivery") ? <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" /> :
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                setOrderID(_id); setProcessState("Ship");
                                                handelOrderUpdate();
                                            }} className="bg-white dark:bg-[#1a1a1a] px-2 border dark:border-neutral-700 rounded text-sm">Ship ?</button>
                                        }
                                    </div>
                                </div>
                                <MoveRight className="w-20 h-20" />
                                <div className="w-full p-3 border dark:border-neutral-700 rounded-xl relative">
                                    <h1 className="text-center">Out For Delivery</h1>
                                    <div className="absolute -right-2 -top-3">
                                        {processingStatus === "Out For Delivery" ? <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" /> :
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                setOrderID(_id); setProcessState("Deliver");
                                                handelOrderUpdate();
                                            }} className="bg-white dark:bg-[#1a1a1a] px-2 border dark:border-neutral-700 rounded text-sm">Delivered ?</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div >
                    )
                })

            }

        </section >
    )
}

export default page