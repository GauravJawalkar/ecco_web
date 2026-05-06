"use client"

import RecentlyViewedProducts from '@/components/Home/RecommendedProducts';
import Loader from '@/components/Loaders/Loader';
import ImagePreviewModal from '@/components/Modals/ImagePreviewModal';
import ReviewModal from '@/components/Modals/ReviewModal';
import SingleProductSkeleton from '@/components/Skeletons/Products/SingleProductSkeleton';
import { discountPercentage } from '@/helpers/discountPercentage';
import ApiClient from '@/interceptors/ApiClient';
import { userProps } from '@/interfaces/commonInterfaces';
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleCheck, ShoppingCart, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const ClientProductPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [mainImage, setMainImage] = useState(0)
    const { data }: { data: userProps } = useUserStore();
    const queryClient = useQueryClient();
    const cartOwnerId = data?._id;
    const [existingRecentlyViewed, setExistingRecentlyViewed] = useState<any | null>({});
    const [showMore, setShowMore] = useState(false);
    const [rateValue, setRateValue] = useState(0);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [previewImageModal, setPreviewImageModal] = useState(false);
    const [previewImage, setPreviewImage] = useState([]);
    const [skip, setSkip] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviews, setReviews] = useState<[] | any>([]);
    const router = useRouter();

    async function getSpecificProduct(id: string) {
        try {
            const response = await ApiClient.get(`/api/getProductDetails/${id}`)
            if (response.data.data) {
                return response.data.data
            }
            return []
        } catch (error) {
            console.error("Error getting the product : ", error);
            return []
        }
    }

    async function rateProduct() {
        const userID = data?._id;
        const productID = product?._id;
        try {
            const response = await ApiClient.post('/api/rating/rateProduct', { userID, productID, rateValue });
            if (response.data.data) {
                toast.success("Thanks For Rating");
                return response.data.data;
            }
            return [];
        } catch (error: any) {
            console.error("Failed to rate the product : ", error);
            if (error.status === 422) {
                toast.error("Can't Rate Unordered Product");
            }
            return [];
        }
    }

    async function getSellerDetails(id: string) {
        try {
            const response = await ApiClient.get(`/api/getSelletDetails/${id}`);
            if (response.data?.data) {
                return response.data?.data
            }
            return [];
        } catch (error) {
            console.error(`Error getting the user details : `, error);

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
            const productId = product?._id;
            const sellerId = seller?._id;
            const response = await ApiClient.post('/api/addToCart', { cartOwner, name, price, image, sellerName, discount, stock, productId, sellerId });
            if (response.data?.data) {
                toast.success("Item Added To Cart");
                return response.data?.data;
            }
            return [];
        } catch (error: any) {
            console.error("Error Adding the product to cart ", error);
            if (error.response?.data?.error === "Unauthorized Access") {
                toast.error("Unauthorized!");
                return router.push('/login');
            }
        }
    }

    async function getReviews() {
        try {
            const response = await ApiClient.get(`/api/review/getReviews/${id}?skip=${skip}`);
            if (response.data.data) {
                setTotalReviews(response.data?.total || 0);
                setReviews([...reviews, ...response.data?.data]);
                return response.data?.data;
            }
            return [];
        } catch (error) {
            console.error("Failed to fetch reviews ", error);
            return []
        }
    }

    const getAverageRating = (rating: { rateNumber: number }[]) => {
        if (rating?.length === 0) return 0;
        const total = rating?.reduce((sum, r) => sum + r.rateNumber, 0);
        return total / rating?.length;
    };

    const { data: product = [], isLoading, isError, isFetched, isSuccess } = useQuery(
        {
            queryFn: () => getSpecificProduct(id as string),
            queryKey: ['product', id],
            enabled: !!id,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        }
    );

    // Add to recently viewed if the product is successfully fetched and viewed
    if (isFetched && isSuccess) {
        try {
            const existingView = JSON.parse(localStorage.getItem(`${'RecentView' + data?._id}`) || "{}");
            if (!Array.isArray(existingView.product)) {
                existingView.product = [];
            }
            if (product?._id && !existingView.product.includes(product._id) && data?._id) {
                existingView.product.push(product._id);
                localStorage.setItem(`${'RecentView' + data?._id}`, JSON.stringify({ ...existingView, user: data?._id }));
            }
        } catch (error) {
            console.error("Failed to parse localStorage item 'RecentView':", error);
            localStorage.setItem(`${'RecentView' + data?._id}`, JSON.stringify({ user: data?._id, product: [product._id] }));
        }
    }

    const { data: seller = [] } = useQuery(
        {
            queryFn: () => getSellerDetails(product?.seller),
            queryKey: ['seller', product?.sellerId],
            enabled: !!product?.seller,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        }
    )

    const addToCartMutation = useMutation({
        mutationFn: async () => await addToCart(),
        onError: () => {
            toast.error("Error Adding the product to cart ");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userCart', cartOwnerId] });
        },
    })

    const rateMutation = useMutation({
        mutationFn: rateProduct,
        onError: () => {
            toast.error("Something Went Wrong");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        }
    })

    const handelRating = () => {
        rateMutation.mutate();
    }

    const handelCart = () => {
        addToCartMutation.mutate();
    }

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(`${'RecentView' + data?._id}`) || "{}");
        if (stored) {
            setExistingRecentlyViewed(stored);
        }
    }, [isFetched, isSuccess]);

    const { data: allReviews = [], isFetching } = useQuery({
        queryFn: getReviews,
        queryKey: ['allReviews', id, skip],
        enabled: !!id,
        refetchOnWindowFocus: false,
    })
    return (
        <>
            <section className='py-10'>
                {isLoading && <SingleProductSkeleton />}

                {(!isLoading && !isError) && <div className='grid grid-cols-1 lg:grid-cols-[0.5fr_3fr_3.5fr] w-full gap-5 lg:gap-0 lg:space-x-4'>

                    {/* Images Tray For More Clear Inspection */}
                    <div className="order-2 lg:order-1 flex lg:block overflow-x-auto lg:overflow-visible gap-3 lg:gap-0 px-5 py-2 lg:py-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className='lg:sticky w-max lg:w-full top-24 flex lg:block gap-3 lg:gap-0'>
                            {
                                product?.images?.map((image: string, index: number) => {
                                    return (
                                        <div onClick={() => { setMainImage(index) }} key={index + Math.random()} className='flex items-center justify-center flex-shrink-0' >
                                            <Image
                                                alt='product_image'
                                                src={image}
                                                height={200}
                                                width={200}
                                                className={`object-contain w-16 h-16 sm:w-20 sm:h-20 lg:w-auto lg:h-auto lg:mb-5 transition-colors duration-200 ease-linear border cursor-pointer rounded-xl dark:border-neutral-700 dark:bg-neutral-900/90 touch-manipulation ${mainImage === index ? 'ring-2 ring-green-500 dark:ring-green-500' : 'ring-transparent'}`} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {/* Main Image Area */}
                    <div className="order-1 lg:order-2 px-5 lg:px-0">
                        <div className='lg:sticky w-full overflow-hidden no-scrollbar top-24'>
                            {product?.images &&
                                <Image
                                    src={product?.images?.[mainImage] || "/userProfile.png"}
                                    alt='product_image'
                                    height={2000}
                                    width={2000}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className='w-full h-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-none object-contain transition-colors duration-200 ease-linear border rounded-xl dark:border-neutral-700 hover:cursor-grab lg:hover:scale-150 dark:bg-neutral-900/90' />}
                        </div>
                    </div>

                    {/* Product Information pricing */}
                    <div className='order-3 flex flex-col items-start justify-start gap-4 sm:gap-5 px-5 lg:px-0'>
                        <div>
                            <h1 className='text-2xl sm:text-3xl lg:text-4xl antialiased font-bold capitalize leading-tight'>{product?.name}</h1>
                        </div>

                        <div>
                            <p className={`w-full text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 capitalize ${showMore ? "line-clamp-none" : "line-clamp-2"}`}>{product?.description}</p>
                            <button onClick={() => { setShowMore((prev) => !prev) }} className='text-xs sm:text-sm font-medium text-blue-500 hover:text-blue-600 touch-manipulation py-1'>{showMore ? "Show Less" : "Show More"}</button>
                        </div>

                        {/* TODO: Made it dynamic */}
                        <div className='flex items-center w-full gap-1.5 sm:gap-2 text-yellow-500'>
                            {<Star onClick={() => { setRateValue(1); handelRating() }} className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer touch-manipulation ${getAverageRating(product?.rating) >= 1 && 'fill-yellow-500'}`} />}
                            <Star onClick={() => { setRateValue(2); handelRating() }} className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer touch-manipulation ${getAverageRating(product?.rating) >= 2 && 'fill-yellow-500'}`} />
                            <Star onClick={() => { setRateValue(3); handelRating() }} className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer touch-manipulation ${getAverageRating(product?.rating) >= 3 && 'fill-yellow-500'}`} />
                            <Star onClick={() => { setRateValue(4); handelRating() }} className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer touch-manipulation ${getAverageRating(product?.rating) >= 4 && 'fill-yellow-500'}`} />
                            <Star onClick={() => { setRateValue(5); handelRating() }} className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer touch-manipulation ${getAverageRating(product?.rating) >= 5 && 'fill-yellow-500 h1/2'}`} />
                            <span className='text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-600 ml-1'>({getAverageRating(product?.rating)?.toFixed(1)})</span>
                        </div>

                        {/* Price and Discount */}
                        <div className='p-3 sm:p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg w-full'>
                            <div className='flex flex-wrap items-end gap-2 sm:gap-3'>
                                <span className='text-2xl sm:text-3xl font-bold text-green-600 leading-none'>
                                    ₹{(product?.price - product?.discount)?.toLocaleString()}
                                </span>
                                <span className='text-sm sm:text-base lg:text-lg font-medium text-gray-500 line-through dark:text-gray-400 mb-0.5'>
                                    ₹{product?.price?.toLocaleString()}
                                </span>
                                <span className='px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold text-green-700 bg-green-100 rounded-md dark:bg-green-900/30 mb-0.5'>
                                    {Math.round(discountPercentage(product.price, product.discount))}% OFF
                                </span>
                            </div>
                            <div className='mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                Inclusive of all taxes
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className='w-full border rounded-xl dark:border-neutral-700 overflow-hidden'>
                            <div className='p-4 sm:p-5 border-b dark:border-neutral-700'>
                                <h3 className='text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200'>Highlights</h3>
                                <ul className='mt-2 sm:mt-3 space-y-1.5 sm:space-y-2'>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck className="w-full h-full" />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-xs sm:text-sm'>Category: <span className='font-medium capitalize'>{product?.category}</span></span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck className="w-full h-full" />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-xs sm:text-sm'>Container: <span className='font-medium capitalize'>{product?.containerType}</span></span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck className="w-full h-full" />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-xs sm:text-sm'>Size: <span className='font-medium capitalize'>{product?.size}</span></span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck className="w-full h-full" />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-xs sm:text-sm'>Non-Replaceable</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Payment Options */}
                            <div className='p-4 sm:p-5 border-b dark:border-neutral-700'>
                                <h3 className='text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200'>Payment Options</h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-3'>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-blue-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className='text-xs sm:text-sm font-medium'>Card Payment</span>
                                    </div>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-purple-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2.5l-.707-.707A1 1 0 0011.172 5H9.828a1 1 0 00-.707.293L8.5 6H5z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className='text-xs sm:text-sm font-medium'>Net Banking</span>
                                    </div>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-green-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className='text-xs sm:text-sm font-medium'>UPI</span>
                                    </div>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-orange-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                                            </svg>
                                        </div>
                                        <span className='text-xs sm:text-sm font-medium'>Cash on Delivery</span>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Details */}
                            <div className='p-4 sm:p-5'>
                                <h3 className='text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200'>Seller Information</h3>
                                <div className='flex items-start mt-2 sm:mt-3'>
                                    <div className='flex-shrink-0 mr-3 sm:mr-4'>
                                        <div className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg font-medium text-white bg-green-500 rounded-full uppercase'>
                                            {seller?.name?.charAt(0)}
                                        </div>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div onClick={() => { router.push(`/stores/${seller?.storeDetails?.storeName}?id=${seller?.storeDetails?.storeId}`) }}
                                            className='flex flex-wrap items-center text-sm sm:text-lg font-medium text-green-600 cursor-pointer hover:text-green-700 capitalize touch-manipulation'
                                        >
                                            <span className="truncate mr-2">{seller?.storeDetails?.storeName}</span>
                                            <span className='text-[10px] sm:text-xs font-normal text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                                (Visit Store)
                                            </span>
                                        </div>
                                        <div className='mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
                                            <div className='flex items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {seller?.isEmailVerified ? "Verified Seller" : "Unverified Seller"}
                                            </div>
                                            <div className='flex items-center mt-0.5 sm:mt-1 truncate'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <span className="truncate">{seller?.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Add to cart and buy now button */}
                        <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-4 mt-2 sm:mt-0">
                            <button
                                className='flex items-center justify-center w-full gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg dark:border-neutral-700 text-sm sm:text-base touch-manipulation min-h-[44px]'
                                onClick={handelCart}>
                                {addToCartMutation.isPending ? <Loader title='Adding...' /> : (<span className='flex items-center justify-center gap-2 sm:gap-4'><ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Add To Cart</span>)}
                            </button>
                            <Link href={`/checkout?id=${product?._id}`} className='flex items-center justify-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-center text-white bg-green-500 rounded-lg hover:bg-green-500/80 touch-manipulation min-h-[44px]'>Buy Now</Link>
                        </div>

                        {/* Ratings and reviews */}
                        <div className='w-full p-3 sm:p-4 my-1 sm:my-2 border dark:border-neutral-700 rounded-xl'>
                            <h1 className='text-lg sm:text-xl font-semibold'>Ratings & Reviews</h1>
                            {/* Ratings Info Div */}
                            <div className='py-3 sm:py-4'>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 sm:gap-5'>
                                    <h1 className='flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl'>
                                        {getAverageRating(product?.rating)?.toFixed(1)} <span><Star className='text-yellow-500 fill-yellow-500 w-4 h-4 sm:w-5 sm:h-5' /></span>
                                    </h1>
                                    <h1 className='text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400'>{product?.rating?.length} Users rated this product & {totalReviews || 0} Reviews Available</h1>
                                </div>
                            </div>
                            {/* Map all the reviews */}
                            {
                                reviews?.map(({ reviewTitle, likes, dislikes, _id, reviewerName, reviewImages }: any) => {
                                    return (
                                        <div key={_id + Math.random()}>
                                            <div className='p-3 sm:p-4 my-2 space-y-2.5 sm:space-y-3 border dark:border-neutral-700 rounded-xl'>
                                                <div className='space-y-1.5 sm:space-y-2'>
                                                    <h1 className='flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 capitalize dark:text-gray-400'>
                                                        <span className="truncate max-w-[120px] sm:max-w-none">{(reviewerName)}</span>
                                                        <span>
                                                            <CircleCheck className='w-3.5 h-3.5 sm:w-5 sm:h-5 text-white fill-gray-500 dark:text-gray-200' />
                                                        </span>
                                                        <span>Certified Review</span>
                                                    </h1>
                                                    <h1 className="text-sm sm:text-base">{reviewTitle}</h1>
                                                    <div className='flex flex-wrap items-center gap-2'>
                                                        {reviewImages?.map((image: string, index: number) => {
                                                            return (
                                                                <div key={index + Math.random()}>
                                                                    <Image
                                                                        onClick={() => {
                                                                            setPreviewImageModal(!previewImageModal);
                                                                            setPreviewImage(reviewImages);
                                                                        }}
                                                                        className='rounded cursor-pointer h-12 w-12 sm:h-14 sm:w-14 object-cover touch-manipulation'
                                                                        src={image}
                                                                        alt={'review Image'}
                                                                        height={50}
                                                                        width={50} />
                                                                    <ImagePreviewModal
                                                                        onClose={() => setPreviewImageModal(!previewImageModal)}
                                                                        isVisible={previewImageModal}
                                                                        images={previewImage} />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                <div className='flex space-x-4 pt-1'>
                                                    <button className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400 touch-manipulation py-1'><ThumbsUp className='w-4 h-4 sm:w-5 sm:h-5' /><span className='text-xs sm:text-sm'>{likes}</span> </button>
                                                    <button className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400 touch-manipulation py-1'><ThumbsDown className='w-4 h-4 sm:w-5 sm:h-5' /><span className='text-xs sm:text-sm'>{dislikes}</span></button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {isFetching && <Loader title='Loading...' />}
                            <div className='py-3 gap-2 flex items-start justify-start flex-wrap'>
                                {/*Add Reviews Components Dynamic */}
                                <button className='px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white bg-green-500 rounded-lg hover:bg-green-500/80 touch-manipulation' onClick={() => { setOpenReviewModal(!openReviewModal) }}>Add Review</button>
                                {totalReviews >= 4 && <button disabled={totalReviews === reviews?.length} className='px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hidden dark:border-neutral-700 touch-manipulation min-h-[44px]' onClick={() => setSkip(skip + 4)}>Load More</button>}
                            </div>
                        </div>
                    </div>
                </div>}
            </section>
            <ReviewModal
                onClose={() => setOpenReviewModal(false)}
                isVisible={openReviewModal}
                reviewedBy={data?._id}
                reviewerName={data?.name}
                reviewedProduct={product?._id} />
            {(isSuccess && isFetched && data?._id) &&
                <div className='pb-5 px-4 lg:px-0'>
                    <div className='relative'>
                        {(existingRecentlyViewed?.product?.length > 0 && existingRecentlyViewed?.user === data?._id) &&
                            <RecentlyViewedProducts tag={false} products={existingRecentlyViewed?.product} />
                        }
                        <h1 className="absolute z-10 top-2 left-2 px-2 py-1 rounded-full text-[9px] font-medium leading-none tracking-wide bg-green-600 dark:bg-green-600 text-white dark:text-white lg:top-0 lg:right-0 lg:left-auto lg:rounded-tr-xl lg:rounded-bl-xl lg:rounded-tl-none lg:rounded-br-none lg:rounded-none lg:bg-green-600 lg:dark:bg-green-600 lg:text-white lg:dark:text-white lg:px-3 lg:py-0 lg:text-sm lg:font-normal lg:tracking-normal lg:leading-normal">Recently Viewed</h1>
                    </div>
                </div>
            }
        </>
    )
}

export default ClientProductPage