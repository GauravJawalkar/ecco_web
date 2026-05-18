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
import { CircleCheck, ShoppingCart, Star, ThumbsDown, ThumbsUp, Tag, ShieldCheck, CreditCard, Banknote, Store, CheckCircle2, Mail, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState, useRef } from 'react'
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

    // Zoom and Pan State
    const [zoom, setZoom] = useState(1);
    const [transformOrigin, setTransformOrigin] = useState("center center");
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Reset zoom when image changes
    useEffect(() => {
        setZoom(1);
        setTransformOrigin("center center");
    }, [mainImage]);

    // Handle Wheel for Scroll to Zoom
    useEffect(() => {
        const container = imageContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (zoom > 1 || e.deltaY < 0) {
                e.preventDefault();
                setZoom(prev => {
                    const newZoom = prev - e.deltaY * 0.005;
                    const constrainedZoom = Math.max(1, Math.min(newZoom, 5));
                    if (constrainedZoom === 1) setTransformOrigin("center center");
                    return constrainedZoom;
                });
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [zoom]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
        const y = Math.max(0, Math.min(100, ((clientY - top) / height) * 100));

        setTransformOrigin(`${x}% ${y}%`);
    };

    const handleMouseEnter = () => {
        if (window.innerWidth >= 1024) {
            setZoom(2.5);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            setZoom(1);
            setTransformOrigin("center center");
        }
    };

    const handleImageClick = () => {
        if (window.innerWidth < 1024) {
            setPreviewImage(product?.images);
            setPreviewImageModal(true);
        }
    };

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

    // Learning Redis for Banner APIS
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
                    <div className="order-2 lg:order-1 flex lg:block overflow-x-auto lg:overflow-visible gap-3 lg:gap-0 px-5 py-2 lg:py-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10">
                        <div className='lg:sticky w-max lg:w-full lg:top-24 flex lg:block gap-3 lg:gap-0'>
                            {
                                product?.images?.map((image: string, index: number) => {
                                    return (
                                        <div onClick={() => { setMainImage(index) }} key={index + Math.random()} className='flex items-center justify-center flex-shrink-0' >
                                            <Image
                                                alt='product_image'
                                                src={image}
                                                height={200}
                                                width={200}
                                                className={`object-contain w-16 h-16 sm:w-20 sm:h-20 lg:w-auto lg:h-auto lg:mb-5 transition-colors duration-200 ease-linear border cursor-pointer rounded-xl dark:border-neutral-800 dark:bg-neutral-900/90 touch-manipulation ${mainImage === index ? 'ring-2 ring-green-500 dark:ring-green-500' : 'ring-transparent'}`} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {/* Main Image Area */}
                    <div className="order-1 lg:order-2 px-5 lg:px-0">
                        <div
                            ref={imageContainerRef}
                            className='relative lg:sticky w-full overflow-hidden no-scrollbar lg:top-24 border rounded-xl dark:border-neutral-800 dark:bg-neutral-900/90 cursor-crosshair touch-pan-y isolate z-0'
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onTouchMove={handleMouseMove}
                            onClick={handleImageClick}
                        >
                            {product?.images &&
                                <Image
                                    src={product?.images?.[mainImage] || "/userProfile.png"}
                                    alt='product_image'
                                    height={2000}
                                    width={2000}
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transformOrigin: transformOrigin,
                                        transition: zoom === 1 ? 'transform 0.3s ease-out, transform-origin 0.3s ease-out' : 'none',
                                    }}
                                    className='w-full h-auto max-h-[50vh] sm:max-h-[60vh] lg:max-h-none object-contain'
                                />
                            }

                            {/* Zoom Hint */}
                            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 text-white text-[10px] sm:text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg transition-opacity duration-300 z-10 flex items-center gap-1.5 ${zoom > 1 ? 'opacity-0' : 'opacity-80'}`}>
                                <ZoomIn className='h-3.5 w-3.5' />
                                <span className="hidden lg:inline">Hover to zoom, scroll to adjust</span>
                                <span className="lg:hidden">Tap to view full screen</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Information pricing */}
                    <div className='order-3 flex flex-col items-start justify-start gap-4 sm:gap-6 px-5 lg:px-0 w-full'>

                        {/* Title & Ratings */}
                        <div className='flex flex-col gap-2 w-full'>
                            <h1 className='text-2xl sm:text-3xl lg:text-4xl antialiased font-bold capitalize leading-tight'>
                                {product?.name}
                            </h1>

                            <div className='flex items-center gap-3 sm:gap-4 mt-1'>
                                <div className='flex items-center gap-1 text-yellow-500'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            onClick={() => { setRateValue(star); handelRating() }}
                                            className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer touch-manipulation transition-colors ${getAverageRating(product?.rating) >= star ? 'fill-yellow-500' : 'fill-gray-200 text-gray-200 dark:fill-neutral-700 dark:text-neutral-700 hover:fill-yellow-300 hover:text-yellow-300'}`}
                                        />
                                    ))}
                                </div>
                                <div className='text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium'>
                                    <span>{getAverageRating(product?.rating)?.toFixed(1)}</span>
                                    <span className='mx-2'>•</span>
                                    <span className='hover:text-green-600 hover:underline cursor-pointer transition-colors'>{product?.rating?.length || 0} Reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className='flex flex-col gap-1 w-full mt-2'>
                            <div className='flex items-end gap-3 sm:gap-4'>
                                <span className='text-3xl sm:text-4xl font-bold text-green-600 leading-none tracking-tight'>
                                    ₹ {(product?.price - product?.discount)?.toLocaleString()}
                                </span>
                                <span className='text-lg sm:text-xl font-medium text-gray-400 line-through mb-0.5'>
                                    ₹{product?.price?.toLocaleString()}
                                </span>
                                <span className='px-2.5 py-1 text-xs sm:text-sm font-bold tracking-wide text-green-700 bg-green-100 rounded-md dark:bg-green-900/30 dark:text-green-400 mb-0.5'>
                                    {Math.round(discountPercentage(product.price, product.discount))}% OFF
                                </span>
                            </div>
                            <div className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium'>
                                Inclusive of all taxes
                            </div>
                        </div>

                        {/* Description */}
                        <div className='w-full mt-1'>
                            <p className={`w-full text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed capitalize ${showMore ? "" : "line-clamp-3"}`}>
                                {product?.description}
                            </p>
                            <button
                                onClick={() => { setShowMore((prev) => !prev) }}
                                className='text-xs sm:text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 touch-manipulation py-1.5 transition-colors inline-block'
                            >
                                {showMore ? "Show Less" : "Read More"}
                            </button>
                        </div>

                        {/* Features & Details Container */}
                        <div className='w-full flex flex-col gap-3 mt-2'>

                            {/* Product Details Grid */}
                            <div className='p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800'>
                                <div className='flex items-center gap-2 mb-4'>
                                    <Tag className='w-4 h-4 text-gray-400' />
                                    <h3 className='text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200'>Product Specification</h3>
                                </div>
                                <div className='grid grid-cols-2 gap-y-4 gap-x-6'>
                                    <div className='flex flex-col'>
                                        <span className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>Category</span>
                                        <span className='text-sm font-medium text-gray-900 dark:text-gray-100 capitalize'>{product?.category}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>Container Type</span>
                                        <span className='text-sm font-medium text-gray-900 dark:text-gray-100 capitalize'>{product?.containerType}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>Size / Quantity</span>
                                        <span className='text-sm font-medium text-gray-900 dark:text-gray-100 capitalize'>{product?.size}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-xs text-gray-500 dark:text-gray-400 mb-0.5'>Return Policy</span>
                                        <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>Non-Replaceable</span>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2'>
                                {/* Buyer Protection & Payments */}
                                <div className='p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800'>
                                    <div className='flex items-center gap-2 mb-4'>
                                        <ShieldCheck className='w-4 h-4 text-green-500' />
                                        <h3 className='text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200'>Secure & Reliable</h3>
                                    </div>
                                    <div className='space-y-3.5'>
                                        <div className='flex items-center gap-3'>
                                            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 shadow-sm'>
                                                <CreditCard className='w-3.5 h-3.5' />
                                            </div>
                                            <div>
                                                <p className='text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100'>Secure Payments</p>
                                                <p className='text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5'>UPI, Cards & Net Banking</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 shadow-sm'>
                                                <Banknote className='w-3.5 h-3.5' />
                                            </div>
                                            <div>
                                                <p className='text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100'>Cash on Delivery</p>
                                                <p className='text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Pay at your doorstep</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Seller Details */}
                                <div className='p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800 flex flex-col'>
                                    <div className='flex items-center gap-2 mb-4'>
                                        <Store className='w-4 h-4 text-gray-400' />
                                        <h3 className='text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200'>Sold By</h3>
                                    </div>
                                    <div className='flex items-center gap-3 flex-1'>
                                        <div className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base font-medium text-white bg-green-600 rounded-xl shadow-sm uppercase'>
                                            {seller?.name?.charAt(0)}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div onClick={() => { router.push(`/stores/${seller?.storeDetails?.storeName}?id=${seller?.storeDetails?.storeId}`) }}
                                                className='flex flex-col group cursor-pointer touch-manipulation'
                                            >
                                                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-green-600 transition-colors capitalize">{seller?.storeDetails?.storeName}</span>
                                                <span className='text-[10px] sm:text-xs text-green-600 font-medium mt-0.5 group-hover:underline'>View Storefront &rarr;</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mt-4 flex items-center justify-between py-2 border-t border-gray-200 dark:border-neutral-700'>
                                        <div className='flex items-center gap-1.5'>
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${seller?.isEmailVerified ? "text-green-500" : "text-gray-400"}`} />
                                            <span className='text-[10px] sm:text-xs text-gray-600 dark:text-gray-400'>
                                                {seller?.isEmailVerified ? "Verified Seller" : "Unverified"}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-1.5 max-w-[50%]'>
                                            <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">{seller?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Add to cart and buy now button */}
                        <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-4 mt-2 sm:mt-0">
                            <button
                                className='flex items-center justify-center w-full gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 border rounded-lg dark:border-neutral-700 text-sm sm:text-base touch-manipulation'
                                onClick={handelCart}>
                                {addToCartMutation.isPending ? <Loader title='Adding...' /> : (<span className='flex items-center justify-center gap-2 sm:gap-4'><ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Add To Cart</span>)}
                            </button>
                            <Link href={`/checkout?id=${product?._id}`} className='flex items-center justify-center w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base text-center text-white bg-green-500 rounded-lg hover:bg-green-500/80 touch-manipulation'>Buy Now</Link>
                        </div>

                        {/* Ratings & Reviews Section */}
                        <div className='w-full mt-8 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6'>
                            <div className={`flex flex-wrap items-center justify-between 
                                ${reviews?.length > 0 ? 'pb-4 mb-4 border-b border-gray-200 dark:border-neutral-800' : 'border-none'} gap-4`}>
                                <div>
                                    <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white pb-0.5'>Customer Reviews</h2>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <div className='flex items-center gap-1 text-yellow-500'>
                                            <Star className='w-4 h-4 fill-yellow-500' />
                                            <span className='font-bold text-gray-900 dark:text-white'>{getAverageRating(product?.rating)?.toFixed(1)}</span>
                                        </div>
                                        <span className='text-sm text-gray-500 dark:text-gray-400'>• {totalReviews || 0} Reviews</span>
                                    </div>
                                </div>
                                <button className='px-4 py-2 text-sm font-normal text-green-600 bg-green-50 hover:bg-green-100 rounded-lg dark:bg-green-500/10 dark:hover:bg-green-500/20 transition-colors touch-manipulation' onClick={() => { setOpenReviewModal(!openReviewModal) }}>Write a Review</button>
                            </div>

                            <div className='flex flex-col'>
                                {reviews?.map(({ reviewTitle, likes, dislikes, _id, reviewerName, reviewImages }: any) => (
                                    <div key={_id + Math.random()} className='py-5 border-b border-gray-100 dark:border-neutral-800 last:border-0'>
                                        <div className='flex items-center justify-between mb-2'>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase'>
                                                    {reviewerName?.charAt(0) || 'U'}
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='text-sm font-bold text-gray-900 dark:text-gray-100 capitalize leading-none'>{reviewerName}</span>
                                                    <span className='flex items-center gap-1 text-[10px] sm:text-xs text-green-600 mt-1 font-medium'>
                                                        <CheckCircle2 className='w-3 h-3' /> Verified Purchase
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">{reviewTitle}</h4>

                                        {reviewImages?.length > 0 && (
                                            <div className='flex flex-wrap items-center gap-2 mb-3'>
                                                {reviewImages?.map((image: string, index: number) => (
                                                    <div key={index + Math.random()}>
                                                        <Image
                                                            onClick={() => {
                                                                setPreviewImageModal(!previewImageModal);
                                                                setPreviewImage(reviewImages);
                                                            }}
                                                            className='rounded-lg cursor-pointer h-16 w-16 sm:h-20 sm:w-20 object-cover border border-gray-200 dark:border-neutral-700 hover:opacity-90 transition-opacity touch-manipulation'
                                                            src={image}
                                                            alt='Review Image'
                                                            height={80}
                                                            width={80}
                                                        />
                                                    </div>
                                                ))}
                                                <ImagePreviewModal
                                                    onClose={() => setPreviewImageModal(!previewImageModal)}
                                                    isVisible={previewImageModal}
                                                    images={previewImage}
                                                />
                                            </div>
                                        )}

                                        <div className='flex items-center gap-4 mt-2'>
                                            <button className='flex items-center gap-1.5 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition-colors touch-manipulation group'>
                                                <ThumbsUp className='w-4 h-4 group-hover:scale-110 transition-transform' />
                                                <span className='text-xs sm:text-sm font-medium'>{likes} Helpful</span>
                                            </button>
                                            <button className='flex items-center gap-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors touch-manipulation group'>
                                                <ThumbsDown className='w-4 h-4 group-hover:scale-110 transition-transform' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {isFetching && <div className="py-4"><Loader title='Loading reviews...' /></div>}

                            {totalReviews >= 4 && totalReviews !== reviews?.length && (
                                <div className='pt-4 flex justify-center'>
                                    <button
                                        className='px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl dark:bg-neutral-900 dark:text-gray-300 dark:border-neutral-700 dark:hover:border-neutral-600 transition-colors touch-manipulation'
                                        onClick={() => setSkip(skip + 4)}>
                                        Load More Reviews
                                    </button>
                                </div>
                            )}
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
                        <h1 className="absolute z-10 top-2 left-2 px-2 py-1 lg:py-1.5 rounded-full text-[9px] font-medium leading-none tracking-wide bg-green-600 dark:bg-green-600 text-white dark:text-white lg:top-0 lg:right-0 lg:left-auto lg:rounded-tr-xl lg:rounded-bl-xl lg:rounded-tl-none lg:rounded-br-none lg:rounded-none lg:bg-green-600 lg:dark:bg-green-600 lg:text-white lg:dark:text-white lg:px-3 lg:text-sm lg:font-normal lg:tracking-normal lg:leading-normal">Recently Viewed</h1>
                    </div>
                </div>
            }
        </>
    )
}

export default ClientProductPage