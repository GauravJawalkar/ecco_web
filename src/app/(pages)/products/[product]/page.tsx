"use client"
import Loader from '@/components/Loaders/Loader';
import { discountPercentage } from '@/helpers/discountPercentage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'


const Product = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [mainImage, setMainImage] = useState(0)

    async function getSpecificProduct(id: string) {
        try {
            const response = await axios.get(`../api/getProductDetails/${id}`)
            if (response.data.data) {
                return response.data.data
            }
            return []
        } catch (error) {
            console.log("Error getting the product : ", error);
            return []
        }
    }

    async function getSellerDetails(id: string) {
        try {
            const response = await axios.get(`../api/getSelletDetails/${id}`);

            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.log(`Error getting the user details : `, error)
            return [];
        }
    }



    const { data: product = [], isLoading, isError } = useQuery(
        {
            queryFn: () => getSpecificProduct(id as string),
            queryKey: ['product'],
            refetchOnWindowFocus: false
        }
    );

    const { data: seller = [] } = useQuery(
        {
            queryFn: () => getSellerDetails(product?.seller),
            queryKey: ['seller', product?.sellerId],
            enabled: !!product?.seller,
            refetchOnWindowFocus: false
        }
    )

    return (
        <section className='py-10'>
            {isLoading && <div className='flex items-center justify-center'>
                <Loader title='Fetching...' />
            </div>}
            <div className='grid grid-cols-[0.5fr_3fr_3fr] w-full gap-5'>

                {/* Images Tray For More Clear Inspection */}
                <div>
                    <div className='sticky top-24 w-full'>
                        {
                            product?.images?.map((image: string, index: number) => {
                                return (
                                    <div onClick={() => { setMainImage(index) }} key={index} className='flex items-center justify-center ' >
                                        <Image
                                            alt='product_image'
                                            src={image}
                                            height={200}
                                            width={200} className='h-auto w-auto mb-5 rounded border dark:border-neutral-500 object-contain cursor-pointer' />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {/* Main Image Area */}
                <div>
                    <div className='w-full overflow-hidden overflow-x-scroll overflow-y-scroll no-scrollbar sticky top-24'>
                        {product?.images &&
                            <Image
                                src={product?.images?.[mainImage] || "/userProfile.png"}
                                alt='product_image'
                                height={200}
                                width={200}
                                className='w-full h-auto rounded border dark:border-neutral-500 hover:cursor-grab hover:scale-150 transition-all ease-linear duration-200 ' />}
                    </div>
                </div>

                {/* Product Information pricing */}
                <div className='px-5 flex items-start justify-start flex-col gap-5'>
                    <div>
                        <h1 className='capitalize font-bold text-4xl antialiased'>{product?.name}</h1>
                    </div>

                    <div>
                        <p className='text-base text-gray-500 capitalize line-clamp-2 w-full'>{product?.description}</p>
                        <button className='text-blue-500 hover:text-blue-600 text-sm'>Show More</button>
                    </div>

                    {/* TODO: Still dummy need to make it dynamic */}
                    <div className='w-full flex gap-2 text-yellow-500'>
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <span className='text-gray-500'>(3,454)</span>
                    </div>

                    {/* Price and Discount */}
                    <div>
                        <h1 className='text-green-600 text-sm pb-1'>Special price</h1>
                        <div className='w-full flex items-baseline gap-2'>
                            <div>
                                <span className='uppercase font-semibold text-[28px] '>
                                    ₹{product?.price - product?.discount}</span>
                            </div>
                            <div className='uppercase font-semibold text-lg line-through decoration-gray-500 decoration-[1px] text-gray-500'>
                                ₹{product?.price}
                            </div>
                            <span className='text-xl font-semibold text-green-600'> {Math.round(discountPercentage(product.price, product.discount))}% off</span>
                        </div>
                    </div>

                    <div className='w-full border dark:border-neutral-500  py-2 px-4 rounded'>

                        {/* Highlights */}
                        <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 gap-4 w-full py-4 border-b dark:border-neutral-500 '>
                            <div className='capitalize font-semibold '>
                                Highlights
                            </div>
                            <div>
                                <li className='capitalize font-normal text-sm pb-1'>
                                    Category: {product?.category}
                                </li>

                                <li className='capitalize font-normal text-sm pb-1'>
                                    Replace: Non Replaceable
                                </li>

                                <li className='capitalize font-normal text-sm pb-1'>
                                    Size: {product?.size}
                                </li>

                            </div>
                        </div>

                        {/* Payment Type */}
                        <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 gap-4 w-full py-4 border-b dark:border-neutral-500'>
                            <div className='capitalize font-semibold '>
                                Payment Options
                            </div>
                            <div>
                                <li className='capitalize font-normal text-sm pb-1'>
                                    Cash on Delivery available
                                </li>

                                <li className='capitalize font-normal text-sm pb-1'>
                                    Carding & Net-Banking
                                </li>

                                <li className='capitalize font-normal text-sm pb-1'>
                                    All UPI options supported
                                </li>

                            </div>
                        </div>


                        {/* Seller Details */}
                        <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 gap-4 w-full py-4 '>
                            <div className='capitalize font-semibold'>
                                Seller
                            </div>
                            <div>
                                <li className='capitalize font-normal text-sm'>🧑‍🦰 {seller?.name}</li>
                                {seller?.isEmailVerified && <li className='capitalize font-normal text-sm'>{seller?.isEmailVerified ? "✅ Verified Seller" : ""}</li>}
                                <li className='font-normal text-sm'>📧 {seller?.email}</li>
                            </div>
                        </div>

                    </div>
                    {/* Add to cart and buy now button */}
                    <div className="flex items-center justify-between w-full gap-4">
                        <button className='px-4 py-3 border dark:border-neutral-500 rounded w-full flex items-center justify-center gap-4'><ShoppingCart /> Add To Cart</button>
                        <button className='px-4 py-3 border dark:border-neutral-500 rounded'><Heart /></button>
                    </div>
                    <button className='px-4 py-3 bg-red-400 rounded text-white w-full' >Buy Now</button>
                </div>
            </div>
        </section >
    )
}

export default Product