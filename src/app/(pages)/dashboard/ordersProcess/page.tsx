"use client"

import Loader from "@/components/Loaders/Loader";
import { generateInvoice } from "@/helpers/invoiceGenerator";
import { userProps } from "@/interfaces/commonInterfaces";
import { useUserStore } from "@/store/UserStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CircleCheckBig, MoveRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

interface OrderItemType {
    _id: string;
    processingStatus: string;
    orderName: string;
    orderImage: string;
    contactNumber: string;
    pinCode: string;
    paymentMethod: string;
    orderQuantity: string;
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
        <section className="min-h-screen h-auto">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold uppercase">Toatal Orders : {totalSellerOrders}</h1>
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
                        order?.orders?.map((orderItem: OrderItemType) => {
                            const { _id, processingStatus, orderName, orderImage, contactNumber, pinCode, paymentMethod, orderQuantity } = orderItem;
                            const sellerName = data?.name;
                            return (
                                <div key={_id} className="p-3 my-4 border rounded dark:border-neutral-700 dark:bg-neutral-900/80">
                                    <div className="flex items-center justify-between p-3">
                                        <h1>Order Id : {_id}</h1>
                                        <div className="space-x-2">
                                            <button onClick={() => { generateInvoice(orderItem, sellerName) }} className="px-2 py-1 text-sm border rounded dark:border-neutral-700">
                                                Generate Invoice</button>
                                            <button className="px-2 py-1 text-sm border rounded dark:border-neutral-700"
                                                onClick={() => { handelShowDetails(_id) }}
                                            >{showDetails === _id ? "Hide Details" : "Show Details"}</button>
                                        </div>
                                    </div>
                                    <div className={`${showDetails === _id ? "block" : "hidden"} space-y-3 my-5`}>
                                        {/* Details */}
                                        <div className="grid grid-cols-5 gap-3">
                                            <div className="border place-items-center dark:border-neutral-700 rounded-xl">
                                                <Image src={orderImage || ""} alt={"order-Image"} width={200} height={200} className="w-32 h-32 object-contain" />
                                            </div>
                                            <div className="flex items-center justify-center py-2 px-4 border dark:border-neutral-700 rounded-xl capitalize text-[15px] line-clamp-2">
                                                <h1>{orderName}</h1>
                                            </div>
                                            <div className="flex items-center justify-center flex-col p-2 border dark:border-neutral-700 rounded-xl text-[15px]">
                                                <h1>
                                                    📞 Contact: +91 {contactNumber}
                                                </h1>
                                                <h1>
                                                    📦 Quantity : {orderQuantity}
                                                </h1>
                                            </div>
                                            <div className="flex items-center justify-center p-2 border dark:border-neutral-700 rounded-xl text-[15px]">📍PinCode : {pinCode}</div>
                                            <div className="flex items-center justify-center p-2 border dark:border-neutral-700 rounded-xl text-[15px]">{paymentMethod === "COD" ? "💸 Cash On Delivery" : "💸 Online"}</div>
                                        </div>
                                        {/* Processing status state */}
                                        <div className="flex items-center justify-between flex-grow gap-3">
                                            <div className="relative w-full p-3 border rounded dark:border-neutral-700">
                                                <h1 className="text-center">Order Confirmed</h1>
                                                <div className="absolute -right-2 -top-3">
                                                    <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" />
                                                </div>
                                            </div>
                                            <MoveRight className="w-20 h-20" />
                                            <div className="relative w-full p-3 border rounded dark:border-neutral-700">
                                                <h1 className="text-center">Order Processing</h1>
                                                <div className="absolute -right-2 -top-3">
                                                    {
                                                        (processingStatus === "Out For Delivery" || processingStatus === "Order Processing" || processingStatus === "Order Shipped") ? <CircleCheckBig className="text-green-500 bg-white dark:bg-[#1a1a1a]" /> :
                                                            <button onClick={(e) => {
                                                                e.preventDefault();
                                                                handelOrderUpdate(order._id, _id, "Processing");
                                                            }} className="bg-white dark:bg-[#1a1a1a] px-2 border dark:border-neutral-700 rounded text-sm">Processed ?</button>
                                                    }
                                                </div>
                                            </div>
                                            <MoveRight className="w-20 h-20" />
                                            <div className="relative w-full p-3 border rounded dark:border-neutral-700">
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
                                            <div className="relative w-full p-3 border rounded dark:border-neutral-700">
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