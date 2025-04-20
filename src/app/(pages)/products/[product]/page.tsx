"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, ShoppingCart, Star, StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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



    const { data: product = [] } = useQuery(
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
            <div className='grid grid-cols-[0.5fr_3fr_3fr] w-full gap-5'>
                {/* Images Tray For More Clear Inspection */}
                <div>
                    {
                        product?.images?.map((image: string, index: number) => {
                            return (
                                <div onClick={() => { setMainImage(index) }} key={index} className='flex items-center justify-center' >
                                    <Link href={'#'}>
                                        <Image alt='product_image' src={image} height={200} width={200} className='h-20 w-20 my-3 rounded border object-contain' />
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
                {/* Main Image Area */}
                <div className='w-full  overflow-hidden'>
                    {product?.images && <Image src={product?.images?.[mainImage] || "/userProfile.png"} alt='product_image' height={200} width={200} className='w-full h-full rounded border hover:cursor-zoom-in hover:scale-150 transition-all ease-linear duration-200' />}
                </div>

                {/* Product Information pricing */}
                <div className='px-5 flex items-start justify-start flex-col gap-5'>
                    <div>
                        <h1 className='capitalize font-bold text-4xl antialiased'>{product?.name}</h1>
                    </div>
                    <div>
                        <p className='text-base text-gray-400 capitalize line-clamp-2 w-full'>{product?.description}</p>
                        <button className='text-blue-500 hover:text-blue-600 text-sm'>Show More</button>
                    </div>

                    {/* TODO: Still dummy need to make it dynamic */}
                    <div className='w-full flex gap-3 text-yellow-500'>
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <span className='text-gray-600'>(3,454)</span>
                    </div>

                    <div className='w-full py-3 flex gap-4'>
                        <div className='uppercase font-semibold text-2xl text-red-500 line-through decoration-gray-400 decoration-slice'>
                            ₹ {product?.price}.00
                        </div>
                        <div className='uppercase font-semibold text-2xl text-blue-600 '>
                            --{'>'} ₹ {product?.price - product?.discount}
                        </div>
                    </div>

                    <div className='grid grid-cols-2 w-full'>
                        <h1 className='capitalize font-normal '>
                            <span className='uppercase font-semibold '>CAtegory : </span>
                            {product?.category}🪴
                        </h1>
                        <h1 className='lowercase font-normal '>
                            <span className='uppercase font-semibold '>Size :</span>
                            {product?.size}
                        </h1>
                    </div>

                    <div className='grid grid-cols-2 w-full'>
                        <h1 className='capitalize font-normal '>
                            <span className='uppercase font-semibold '>Seller : </span>
                            {seller?.name}
                        </h1>
                        <h1 className='lowercase font-normal '>
                            <span className='uppercase font-semibold '>EMail :</span>
                            {seller?.email}
                        </h1>
                    </div>

                    {seller?.isEmailVerified && <div className='uppercase font-semibold flex items-center justify-center w-full animate-pulse'>
                        <h1>
                            <span>
                                {seller?.isEmailVerified ? " ✅ Verified Seller" : "❌ UnVerified Seller"}
                            </span>
                        </h1>
                    </div>}

                    <div className="flex items-center justify-between w-full gap-4">
                        <button className='px-4 py-3 border rounded w-full flex items-center justify-center gap-4'><ShoppingCart /> Add To Cart</button>
                        <button className='px-4 py-3 border rounded'><Heart /></button>
                    </div>
                    <button className='px-4 py-3 bg-red-400 rounded text-white w-full' >Buy Now</button>
                </div>
            </div>
        </section >
    )
}

export default Product