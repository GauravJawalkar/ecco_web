"use client"
import Loader from '@/components/Loaders/Loader';
import { useUserStore } from '@/store/UserStore'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

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
    const { data }: any = useUserStore();

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
        <section >
            <div className='relative my-5'>
                <input type="search" className='w-full p-2 rounded ring-1 ring-gray-200 dark:ring-neutral-700 focus:outline-none' placeholder='Search Your Orders Here' />
                <button className='absolute top-0 right-0 flex items-center justify-center gap-2 p-2 text-white bg-blue-500  hover:bg-blue-500/80'>
                    <Search className='w-5 h-5' />  Search Orders</button>
            </div>
            {isPending && <Loader title='Just A Second...' />}
            {isError && <h1>Something Went Wrong</h1>}
            {(!isPending && myOrders?.length === 0) && <h1>No Orders Found</h1>}
            {
                myOrders?.map(({ _id, orderName, orderImage, orderPrice, orderDiscount, deliveryAddress, pinCode, processingStatus, paymentStatus, orderQuantity }: myOrdersProps) => {
                    return (
                        <div key={_id} className='grid grid-cols-[2fr_1fr_1.5fr] gap-3 border dark:border-neutral-700 rounded-xl my-4'>
                            <div className='flex items-start justify-start p-3 text-center gap-3'>
                                <div className='w-[25%]'>
                                    <Image src={orderImage || '/happy.svg'} alt='order-image' height={800} width={800} className='object-contain border dark:border-neutral-700 rounded-xl h-28 w-28' />
                                </div>
                                <div className='w-full space-y-2 '>
                                    <h1 className='font-semibold capitalize line-clamp-2 text-start'>{orderName}</h1>
                                    <p className='text-sm text-start'>Quantity : {orderQuantity}</p>
                                </div>
                            </div>
                            <div className='flex items-start justify-center gap-3 p-3 border-l border-r dark:border-neutral-700 '>
                                <div className='space-y-2'>
                                    <label className='font-semibold'>MRP</label>
                                    <h1 className='text-sm text-start'>₹ {orderPrice}</h1>
                                </div>
                                <div className='px-3 space-y-2 border-l border-r dark:border-neutral-700'>
                                    <label className='font-semibold'>Discount</label>
                                    <h1 className='text-sm text-center text-red-600'>₹ {orderDiscount}</h1>
                                </div>
                                <div className='space-y-2'>
                                    <label className='font-semibold'>Total</label>
                                    <h1 className='text-sm text-green-600 text-start'>₹ {orderPrice - orderDiscount}</h1>
                                </div>
                            </div>
                            <div className='p-3 text-center '>
                                <h1 className='text-start text-sm'>🗺️ : {deliveryAddress}</h1>
                                <h1 className='text-start text-sm'>📍 : {pinCode}</h1>
                                <h1 className='text-start text-sm'>🟢 : {processingStatus}</h1>
                                <h1 className='text-start text-sm'>💸 : {paymentStatus}</h1>
                            </div>
                        </div>
                    )
                })
            }
        </section >
    )
}

export default page