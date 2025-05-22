"use client"
import { discountPercentage } from '@/helpers/discountPercentage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const page = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [address, setAddress] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [landMark, setLandMark] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [quantity, setQuantity] = useState(1);


    if (!id) {
        return router.back();
    }

    async function getProductDetails(id: string) {
        try {
            const response = await axios.get(`/api/getProductDetails/${id}`);
            if (response.data.data) {
                return response.data.data;
            }
            return []
        } catch (error) {
            console.error("Error getting the products : ", error);
            return [];
        }
    }

    async function getSellerDetails(id: string) {
        try {
            const response = await axios.get(`/api/getSelletDetails/${id}`);
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error getting seller Details : ", error);
            return []
        }
    }

    const { data: productDetails = [], isPending, isError } = useQuery({
        queryFn: async () => await getProductDetails(id),
        queryKey: ['productDetails'],
        enabled: !!id,
    })

    const { data: sellerDetails = [] } = useQuery(
        {
            queryKey: ['sellerDetails'],
            queryFn: () => getSellerDetails(productDetails?.seller),
            enabled: !!productDetails?.seller,
        }
    )

    console.log(productDetails.length);


    return (
        <div className='grid grid-cols-[3fr_1fr] my-5 gap-4'>

            <div className='p-5 border dark:border-neutral-700 rounded-xl'>
                <h1 className='py-5 uppercase font-semibold text-start text-lg'>Order Summary</h1>
                <div className='w-full grid grid-cols-[1fr_3fr] gap-4 border dark:border-neutral-700 rounded-xl p-5'>
                    <div className='border dark:border-neutral-700 rounded-xl p-3'>
                        <Image src={productDetails?.images?.[0] || "/userProfile.png"} alt={"product-image"} height={200} width={200} className='rounded-xl h-36 w-full object-contain' />
                        <div className='flex items-center justify-center gap-3'>
                            <button className='p-2 border dark:border-neutral-700 rounded-full'><Minus className='h-4 w-4' /></button>
                            <span>{quantity}</span>
                            <button className='p-2 border dark:border-neutral-700 rounded-full'><Plus className='h-4 w-4' /></button>
                        </div>
                    </div>

                    <div className='space-y-3 content-center'>
                        <h1 className='capitalize text-xl font-semibold'>{productDetails?.name}</h1>
                        <h1 className='text-sm line-clamp-3 capitalize text-gray-600 dark:text-gray-400'>{productDetails?.description}</h1>
                        <h1 className='font-semibold'>
                            <span className='text-gray-500 line-through'>₹ {productDetails?.price}</span>
                            <span className='text-xl px-3'>
                                ₹ {productDetails?.price - productDetails?.discount}
                            </span>
                            <span className='text-green-500'>{Math.round(discountPercentage(productDetails?.price, productDetails?.discount))} % off</span>
                        </h1>
                        <div>
                            <h1 className='capitalize text-sm'>Seller : 🧑‍🦰 {sellerDetails?.name}</h1>
                            <h1 className='capitalize text-sm'>Store : 🏪 {sellerDetails?.name}'s Store</h1>
                            <h1 className='text-sm'>Email : 📧 {sellerDetails?.email}</h1>
                        </div>
                    </div>
                </div>

                <h1 className='py-5 uppercase font-semibold text-start text-lg'>Delivery Address</h1>
                <div className='w-full grid grid-cols-2 gap-4'>
                    <div className='w-full'>
                        <textarea required rows={1} className='w-full outline-none border rounded-md px-4 py-2 bg-transparent dark:border-neutral-700' placeholder='Enter Your Delivery Address Here' />
                    </div>
                    <div className='w-full'>
                        <input required type="number" className='w-full outline-none border rounded-md px-4 py-2 bg-transparent dark:border-neutral-700' placeholder='Enter Your PinCode' />
                    </div>
                    <div className='w-full'>
                        <input required type="text" className='w-full outline-none border rounded-md px-4 py-2 bg-transparent dark:border-neutral-700' placeholder='Enter A LandMark Here' />
                    </div>
                    <div className='w-full flex items-center justify-center gap-3'>
                        +91 <input required type="tel" className='w-full outline-none border rounded-md px-4 py-2 bg-transparent dark:border-neutral-700' placeholder='Enter Contact Number' />
                    </div>
                </div>

            </div>

            {/* Grid Second half */}
            <div>
                Price Details
            </div>
        </div >
    )
}

export default page