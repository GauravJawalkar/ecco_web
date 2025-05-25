"use client"
import Loader from '@/components/Loaders/Loader';
import { discountPercentage } from '@/helpers/discountPercentage';
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Product = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [mainImage, setMainImage] = useState(0)
    const { data }: any = useUserStore();
    const queryClient = useQueryClient();
    const cartOwnerId = data?._id;
    const [fill, setFill] = useState(false)

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

    async function addToCart() {
        try {
            const cartOwner = data?._id;
            const name = product?.name;
            const price = product?.price;
            const image = product?.images[0];
            const discount = product?.discount;
            const sellerName = seller?.name;
            const stock = product?.stock;
            const response = await axios.post('../api/addToCart', { cartOwner, name, price, image, sellerName, discount, stock });
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error Adding the product to cart ", error);
            toast.error("Error Adding the product to cart ");
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

    const addToCartMutation = useMutation({
        mutationFn: async () => await addToCart(),
        onSuccess: () => {
            toast.success("Item Added To Cart");
            queryClient.invalidateQueries({ queryKey: ['userCart', cartOwnerId] });
        }
    })

    const handelCart = () => {
        console.log("Add to Cart clicked");
        addToCartMutation.mutate();
    }

    const handelOrder = () => {
        try {

        } catch (error) {
            console.error("Error setting up the order : ", error)
        }
    }

    return (
        <section className='py-10'>
            {isLoading && <div className='flex items-center justify-center'>
                <Loader title='Fetching...' />
            </div>}

            {(!isLoading && !isError) && <div className='grid grid-cols-[0.5fr_3fr_3fr] w-full gap-5'>

                {/* Images Tray For More Clear Inspection */}
                <div>
                    <div className='sticky w-full top-24'>
                        {
                            product?.images?.map((image: string, index: number) => {
                                return (
                                    <div onClick={() => { setMainImage(index) }} key={index} className='flex items-center justify-center ' >
                                        <Image
                                            alt='product_image'
                                            src={image}
                                            height={200}
                                            width={200}
                                            className='object-contain w-auto h-auto mb-5 border rounded cursor-pointer dark:border-neutral-500' />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {/* Main Image Area */}
                <div>
                    <div className='sticky w-full overflow-hidden overflow-x-scroll overflow-y-scroll no-scrollbar top-24'>
                        {product?.images &&
                            <Image
                                src={product?.images?.[mainImage] || "/userProfile.png"}
                                alt='product_image'
                                height={2000}
                                width={2000}
                                className='w-full h-auto transition-all duration-200 ease-linear border rounded dark:border-neutral-500 hover:cursor-grab hover:scale-150 ' />}
                    </div>
                </div>

                {/* Product Information pricing */}
                <div className='flex flex-col items-start justify-start gap-5 px-5'>
                    <div>
                        <h1 className='text-4xl antialiased font-bold capitalize'>{product?.name}</h1>
                    </div>

                    <div>
                        <p className='w-full text-base text-gray-500 capitalize line-clamp-2'>{product?.description}</p>
                        <button className='text-sm text-blue-500 hover:text-blue-600'>Show More</button>
                    </div>

                    {/* TODO: Still dummy need to make it dynamic */}
                    <div className='flex w-full gap-2 text-yellow-500'>
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <Star className='w-5 h-5' />
                        <span className='text-gray-500'>(3,454)</span>
                    </div>

                    {/* Price and Discount */}
                    <div>
                        <h1 className='pb-1 text-sm text-green-600'>Special price</h1>
                        <div className='flex items-baseline w-full gap-2'>
                            <div>
                                <span className='uppercase font-semibold text-[28px] '>
                                    ₹{product?.price - product?.discount}</span>
                            </div>
                            <div className='uppercase font-semibold text-lg line-through decoration-gray-500 decoration-[1px] text-gray-500'>
                                ₹{product?.price}
                            </div>
                            <span className='text-2xl font-semibold text-green-600'> {Math.round(discountPercentage(product.price, product.discount))}% off</span>
                        </div>
                    </div>

                    <div className='w-full px-4 py-2 border rounded dark:border-neutral-500'>

                        {/* Highlights */}
                        <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 gap-4 w-full py-4 border-b dark:border-neutral-500 '>
                            <div className='font-semibold capitalize '>
                                Highlights
                            </div>
                            <div>
                                <li className='pb-1 text-sm font-normal capitalize'>
                                    Category: {product?.category}
                                </li>

                                <li className='pb-1 text-sm font-normal capitalize'>
                                    Replace: Non Replaceable
                                </li>

                                <li className='pb-1 text-sm font-normal capitalize'>
                                    Size: {product?.size}
                                </li>

                            </div>
                        </div>

                        {/* Payment Type */}
                        <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 gap-4 w-full py-4 border-b dark:border-neutral-500'>
                            <div className='font-semibold capitalize '>
                                Payment Options
                            </div>
                            <div>
                                <li className='pb-1 text-sm font-normal capitalize'>
                                    Cash on Delivery available
                                </li>

                                <li className='pb-1 text-sm font-normal capitalize'>
                                    Carding & Net-Banking
                                </li>

                                <li className='pb-1 text-sm font-normal capitalize'>
                                    All UPI options supported
                                </li>

                            </div>
                        </div>


                        {/* Seller Details */}
                        <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 gap-4 w-full py-4 '>
                            <div className='font-semibold capitalize'>
                                Seller
                            </div>
                            <div>
                                <li className='text-sm font-normal capitalize'>🧑‍🦰 {seller?.name}</li>
                                {seller?.isEmailVerified && <li className='text-sm font-normal capitalize'>{seller?.isEmailVerified ? "✅ Verified Seller" : ""}</li>}
                                <li className='text-sm font-normal'>📧 {seller?.email}</li>
                            </div>
                        </div>

                    </div>
                    {/* Add to cart and buy now button */}
                    <div className="flex items-center justify-between w-full gap-4">
                        <button
                            className='flex items-center justify-center w-full gap-4 px-4 py-3 border rounded dark:border-neutral-500'
                            onClick={handelCart}>
                            {addToCartMutation.isPending ? <Loader title='Adding...' /> : (<span className='flex items-center justify-center gap-4'><ShoppingCart />
                                Add To Cart</span>)}
                        </button>
                        <button onClick={() => { setFill(!fill) }} className='p-3 border rounded-full dark:border-neutral-500'>
                            <Heart className={`${fill ? "fill-red-500 text-red-500" : "fill-none"} `} />
                        </button>
                    </div>
                    <Link href={`/checkout?id=${product?._id}`} className='w-full px-4 py-3 text-center text-white bg-green-500 rounded hover:bg-green-500/80'>Buy Now</Link>
                </div>
            </div>}

        </section >
    )
}

export default Product