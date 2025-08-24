"use client"
import RecentlyViewedProducts from '@/components/Home/RecommendedProducts';
import Loader from '@/components/Loaders/Loader';
import ImagePreviewModal from '@/components/Modals/ImagePreviewModal';
import ReviewModal from '@/components/Modals/ReviewModal';
import SingleProductSkeleton from '@/components/Skeletons/Products/SingleProductSkeleton';
import { discountPercentage } from '@/helpers/discountPercentage';
import { userProps } from '@/interfaces/commonInterfaces';
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CheckCheck, CheckCircle, CircleCheck, ShoppingCart, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Product = () => {
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
            const response = await axios.get(`../api/getProductDetails/${id}`, { timeout: 2000 })
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
            const response = await axios.post('/api/rating/rateProduct', { userID, productID, rateValue });
            if (response.data.data) {
                toast.success("Thanks For Rating");
                return response.data.data;
            }
            return [];
        } catch (error: any) {
            console.error("Failed to rate the product : ", error);
            if (error.status === 401) {
                toast.error("Can't Rate Unordered Product");
            }
            return [];
        }
    }

    async function getSellerDetails(id: string) {
        try {
            const response = await axios.get(`../api/getSelletDetails/${id}`);
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
            const response = await axios.post('../api/addToCart', { cartOwner, name, price, image, sellerName, discount, stock, productId, sellerId });
            if (response.data.data) {
                toast.success("Item Added To Cart");
                return response.data.data;
            }
            return [];
        } catch (error: any) {
            console.error("Error Adding the product to cart ", error);
            if (error.response.status === 403) {
                toast.error("Unauthorized!");
                return router.push('/login');
            }
        }
    }

    async function getReviews() {
        try {
            const response = await axios.get(`/api/review/getReviews/${id}?skip=${skip}`);
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

                {(!isLoading && !isError) && <div className='grid grid-cols-[0.5fr_3fr_3.5fr] w-full space-x-4'>

                    {/* Images Tray For More Clear Inspection */}
                    <div>
                        <div className='sticky w-full top-24'>
                            {
                                product?.images?.map((image: string, index: number) => {
                                    return (
                                        <div onClick={() => { setMainImage(index) }} key={index + Math.random()} className='flex items-center justify-center ' >
                                            <Image
                                                alt='product_image'
                                                src={image}
                                                height={200}
                                                width={200}
                                                className='object-contain w-auto h-auto mb-5 transition-colors duration-200 ease-linear border cursor-pointer rounded-xl dark:border-neutral-700 dark:bg-neutral-900/90' />
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
                                    className='w-full h-auto transition-colors duration-200 ease-linear border rounded-xl dark:border-neutral-700 hover:cursor-grab hover:scale-150 dark:bg-neutral-900/90' />}
                        </div>
                    </div>

                    {/* Product Information pricing */}
                    <div className='flex flex-col items-start justify-start gap-5 px-5'>
                        <div>
                            <h1 className='text-4xl antialiased font-bold capitalize'>{product?.name}</h1>
                        </div>

                        <div>
                            <p className={`w-full text-sm text-gray-500 dark:text-gray-400  capitalize ${showMore ? "line-clamp-none" : "line-clamp-2"}`}>{product?.description}</p>
                            <button onClick={() => { setShowMore((prev) => !prev) }} className='text-sm text-blue-500 hover:text-blue-600'>{showMore ? "Show Less" : "Show More"}</button>
                        </div>

                        {/* TODO: Made it dynamic */}
                        <div className='flex w-full gap-2 text-yellow-500'>
                            {<Star onClick={() => { setRateValue(1); handelRating() }} className={`w-5 h-5 cursor-pointer ${getAverageRating(product?.rating) >= 1 && 'fill-yellow-500'}`} />}
                            <Star onClick={() => { setRateValue(2); handelRating() }} className={`w-5 h-5 cursor-pointer ${getAverageRating(product?.rating) >= 2 && 'fill-yellow-500'}`} />
                            <Star onClick={() => { setRateValue(3); handelRating() }} className={`w-5 h-5 cursor-pointer ${getAverageRating(product?.rating) >= 3 && 'fill-yellow-500'}`} />
                            <Star onClick={() => { setRateValue(4); handelRating() }} className={`w-5 h-5 cursor-pointer ${getAverageRating(product?.rating) >= 4 && 'fill-yellow-500'}`} />
                            <Star onClick={() => { setRateValue(5); handelRating() }} className={`w-5 h-5 cursor-pointer ${getAverageRating(product?.rating) >= 5 && 'fill-yellow-500 h1/2'}`} />
                            <span className='text-gray-500 dark:text-gray-600'>({getAverageRating(product?.rating)})</span>
                        </div>

                        {/* Price and Discount */}
                        <div className='p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg w-full'>
                            <div className='flex items-end gap-3'>
                                <span className='text-3xl font-bold text-green-600'>
                                    ₹{(product?.price - product?.discount)?.toLocaleString()}
                                </span>
                                <span className='text-lg font-medium text-gray-500 line-through dark:text-gray-400'>
                                    ₹{product?.price?.toLocaleString()}
                                </span>
                                <span className='px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-md dark:bg-green-900/30'>
                                    {Math.round(discountPercentage(product.price, product.discount))}% OFF
                                </span>
                            </div>
                            <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                                Inclusive of all taxes
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className='w-full border rounded-xl dark:border-neutral-700 overflow-hidden'>
                            <div className='p-5 border-b dark:border-neutral-700'>
                                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Highlights</h3>
                                <ul className='mt-3 space-y-2'>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck size={20} />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-sm'>Category: <span className='font-medium capitalize'>{product?.category}</span></span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck size={20} />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-sm'>Container: <span className='font-medium capitalize'>{product?.containerType}</span></span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck size={20} />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-sm'>Size: <span className='font-medium capitalize'>{product?.size}</span></span>
                                    </li>
                                    <li className='flex items-start'>
                                        <span className='flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500'>
                                            <CircleCheck size={20} />
                                        </span>
                                        <span className='text-gray-600 dark:text-gray-300 text-sm'>Non-Replaceable</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Payment Options */}
                            <div className='p-5 border-b dark:border-neutral-700'>
                                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Payment Options</h3>
                                <div className='grid grid-cols-2 gap-3 mt-3'>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-blue-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className='text-sm font-medium'>Card Payment</span>
                                    </div>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-purple-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2.5l-.707-.707A1 1 0 0011.172 5H9.828a1 1 0 00-.707.293L8.5 6H5z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className='text-sm font-medium'>Net Banking</span>
                                    </div>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-green-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className='text-sm font-medium'>UPI</span>
                                    </div>
                                    <div className='flex items-center p-2 bg-gray-100 rounded-lg dark:bg-neutral-700/50'>
                                        <div className='p-1 mr-2 text-white bg-orange-500 rounded-md'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                                            </svg>
                                        </div>
                                        <span className='text-sm font-medium'>Cash on Delivery</span>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Details */}
                            <div className='p-5'>
                                <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Seller Information</h3>
                                <div className='flex items-start mt-3'>
                                    <div className='flex-shrink-0 mr-4'>
                                        <div className='flex items-center justify-center w-12 h-12 text-lg font-medium text-white bg-green-500 rounded-full uppercase'>
                                            {seller?.name?.charAt(0)}
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <div
                                            onClick={() => { router.push(`/stores/${seller?.storeDetails?.storeName}?id=${seller?.storeDetails?.storeId}`) }}
                                            className='flex items-center text-lg font-medium text-green-600 cursor-pointer hover:text-green-700'
                                        >
                                            {seller?.storeDetails?.storeName}
                                            <span className='ml-2 text-xs font-normal text-gray-500 dark:text-gray-400'>
                                                (Visit Store)
                                            </span>
                                        </div>
                                        <div className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                                            <div className='flex items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {seller?.isEmailVerified ? "Verified Seller" : "Unverified Seller"}
                                            </div>
                                            <div className='flex items-center mt-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                {seller?.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Add to cart and buy now button */}
                        <div className="flex items-center justify-between w-full gap-4">
                            <button
                                className='flex items-center justify-center w-full gap-4 px-4 py-3 border rounded-lg dark:border-neutral-700'
                                onClick={handelCart}>
                                {addToCartMutation.isPending ? <Loader title='Adding...' /> : (<span className='flex items-center justify-center gap-4'><ShoppingCart />
                                    Add To Cart</span>)}
                            </button>
                            <Link href={`/checkout?id=${product?._id}`} className='w-full px-4 py-3 text-center text-white bg-green-500 rounded-lg hover:bg-green-500/80'>Buy Now</Link>
                        </div>

                        {/* Ratings and reviews */}
                        <div className='w-full p-4 my-2 border dark:border-neutral-700 rounded-xl'>
                            <h1 className='text-xl font-semibold'>Ratings & Reviews</h1>
                            {/* Ratings Info Div */}
                            <div className='py-4'>
                                <div className='flex items-center justify-start space-x-5'>
                                    <h1 className='flex items-center gap-2 text-xl'>
                                        {getAverageRating(product?.rating)} <span><Star className='text-yellow-500 fill-yellow-500' /></span>
                                    </h1>
                                    <h1 className='text-base text-gray-600 dark:text-gray-400'>{product?.rating?.length} Users rated this product & {totalReviews || 0} Reviews Available</h1>
                                </div>
                            </div>
                            {/* Map all the reviews */}
                            {
                                reviews?.map(({ reviewTitle, likes, dislikes, _id, reviewerName, reviewImages }: any) => {
                                    return (
                                        <div key={_id + Math.random()}>
                                            <div className='p-4 my-2 space-y-3 border dark:border-neutral-700 rounded-xl'>
                                                <div className='space-y-2'>
                                                    <h1 className='flex gap-2 text-sm text-gray-600 capitalize dark:text-gray-400'>
                                                        {(reviewerName)}
                                                        <span>
                                                            <CircleCheck className='w-5 h-5 text-white fill-gray-500 dark:text-gray-200' />
                                                        </span>
                                                        Certified Review
                                                    </h1>
                                                    <h1>{reviewTitle}</h1>
                                                    <div className='flex items-center gap-2'>
                                                        {reviewImages?.map((image: string, index: number) => {
                                                            return (
                                                                <div key={index + Math.random()}>
                                                                    <Image
                                                                        onClick={() => {
                                                                            setPreviewImageModal(!previewImageModal);
                                                                            setPreviewImage(reviewImages);
                                                                        }}
                                                                        className='rounded cursor-pointer h-14 w-14'
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
                                                <div className='flex space-x-4'>
                                                    <button className='flex gap-2 text-gray-500 dark:text-gray-400 '><ThumbsUp className='w-5 h-5 ' /><span className='text-sm'>{likes}</span> </button>
                                                    <button className='flex gap-2 text-gray-500 dark:text-gray-400 '><ThumbsDown className='w-5 h-5' /><span className='text-sm'>{dislikes}</span></button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {isFetching && <Loader title='Loading...' />}
                            <div className='py-3 gap-2 flex items-start justify-start'>
                                {/*Add Reviews Components Dynamic */}
                                <button className='px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-500/80' onClick={() => { setOpenReviewModal(!openReviewModal) }}>Add Review</button>
                                {totalReviews >= 4 && <button disabled={totalReviews === reviews?.length} className='px-3 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hidden dark:border-neutral-700' onClick={() => setSkip(skip + 4)}>Load More</button>}
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
                <div className='pb-5'>
                    <div className='relative'>
                        {(existingRecentlyViewed?.product?.length > 0 && existingRecentlyViewed?.user === data?._id) &&
                            <RecentlyViewedProducts tag={false} products={existingRecentlyViewed?.product} />
                        }
                        <h1 className='absolute top-0 right-0 z-10 p-2 text-white bg-green-500 rounded-tr-xl'>Recently Viewed</h1>
                    </div>
                </div>
            }
        </>
    )
}

export default Product