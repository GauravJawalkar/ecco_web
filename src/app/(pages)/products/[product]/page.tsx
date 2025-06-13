"use client"
import RecentlyViewedProducts from '@/components/Home/RecommendedProducts';
import Loader from '@/components/Loaders/Loader';
import ImagePreviewModal from '@/components/Modals/ImagePreviewModal';
import ReviewModal from '@/components/Modals/ReviewModal';
import { discountPercentage } from '@/helpers/discountPercentage';
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleCheck, ShoppingCart, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
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
    const { data }: any = useUserStore();
    const queryClient = useQueryClient();
    const cartOwnerId = data?._id;
    const [existingRecentlyViewed, setExistingRecentlyViewed] = useState<any | null>({});
    const [showMore, setShowMore] = useState(false);
    const [rateValue, setRateValue] = useState(0);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [previewImageModal, setPreviewImageModal] = useState(false);
    const [previewImage, setPreviewImage] = useState([]);
    const router = useRouter();

    async function getSpecificProduct(id: string) {
        try {
            const response = await axios.get(`../api/getProductDetails/${id}`)
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
            if (response.data.data) {
                return response.data.data
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
            const response = await axios.get(`/api/review/getReviews/${id}`);
            if (response.data.data) {
                return response.data.data;
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

    const { data: product = [], isLoading, isError, isSuccess, isFetched } = useQuery(
        {
            queryFn: () => getSpecificProduct(id as string),
            queryKey: ['product', id],
            enabled: !!id,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        }
    );

    // Add to recently viewed if the product is successfully fetched and viewed
    if (isSuccess && isFetched) {
        try {
            const existingView = JSON.parse(localStorage.getItem(`${'RecentView' + data?._id}`) || "{}");
            if (!Array.isArray(existingView.product)) {
                existingView.product = [];
            }

            if (product?._id && !existingView.product.includes(product._id)) {
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
    }, [isSuccess, isFetched]);

    const { data: allReviews = [] } = useQuery({
        queryFn: getReviews,
        queryKey: ['allReviews'],
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    })

    return (
        <>
            <section className='py-10'>
                {isLoading && <div className='flex items-center justify-center'>
                    <Loader title='Fetching...' />
                </div>}

                {(!isLoading && !isError) && <div className='grid grid-cols-[0.5fr_3fr_3.5fr] w-full space-x-4'>

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
                                                className='object-contain w-auto h-auto mb-5 transition-colors duration-200 ease-linear border cursor-pointer rounded-xl dark:border-neutral-700 dark:bg-neutral-950/50' />
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
                                    className='w-full h-auto transition-colors duration-200 ease-linear border rounded-xl dark:border-neutral-700 hover:cursor-grab hover:scale-150 dark:bg-neutral-950/50' />}
                        </div>
                    </div>

                    {/* Product Information pricing */}
                    <div className='flex flex-col items-start justify-start gap-5 px-5'>
                        <div>
                            <h1 className='text-4xl antialiased font-bold capitalize'>{product?.name}</h1>
                        </div>

                        <div>
                            <p className={`w-full text-base text-gray-500 dark:text-gray-400   capitalize ${showMore ? "line-clamp-none" : "line-clamp-2"}`}>{product?.description}</p>
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
                        <div>
                            <h1 className='pb-1 text-sm text-green-600'>Special price</h1>
                            <div className='flex items-baseline w-full gap-2'>
                                <div>
                                    <span className='uppercase font-semibold text-[28px] '>
                                        ₹{product?.price - product?.discount}</span>
                                </div>
                                <div className='uppercase font-semibold text-lg line-through decoration-gray-500 decoration-[1px] text-gray-500 dark:text-gray-400  '>
                                    ₹{product?.price}
                                </div>
                                <span className='text-2xl font-semibold text-green-600'> {Math.round(discountPercentage(product.price, product.discount))}% off</span>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className='w-full px-4 py-2 border rounded-lg dark:border-neutral-700'>

                            {/* Highlights */}
                            <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 dark:text-gray-400   gap-4 w-full py-4 border-b dark:border-neutral-700 '>
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
                            <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 dark:text-gray-400   gap-4 w-full py-4 border-b dark:border-neutral-700'>
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
                            <div className='grid grid-cols-[0.7fr_2fr] text-gray-500 dark:text-gray-400   gap-4 w-full py-4 '>
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
                                    <h1 className='text-base text-gray-600 dark:text-gray-400'>{product?.rating?.length} Users rated this product & {allReviews?.[0]?.reviews?.length || 0} Reviewed It</h1>
                                </div>
                            </div>
                            {/* Map all the reviews */}
                            {
                                allReviews.map((review: any, index: number) => {
                                    return (
                                        <div key={index}>
                                            {review?.reviews.map(({ reviewTitle, likes, dislikes, _id, reviewerName, reviewImages }: any) => {
                                                return (
                                                    <div className='p-4 my-2 space-y-3 border dark:border-neutral-700 rounded-xl' key={_id}>
                                                        <div className='space-y-2'>
                                                            <h1 className='flex gap-2 text-sm text-gray-600 capitalize dark:text-gray-400'> {(reviewerName)} <span><CircleCheck className='w-5 h-5 text-white fill-gray-500' /></span> Certified Review </h1>
                                                            <h1>{reviewTitle}</h1>
                                                            <div className='flex items-center gap-2'>
                                                                {reviewImages?.map((image: string, index: number) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <Image
                                                                                onClick={() => {
                                                                                    setPreviewImageModal(!previewImageModal);
                                                                                    setPreviewImage(reviewImages);
                                                                                }}
                                                                                className='rounded cursor-pointer'
                                                                                src={image}
                                                                                alt={'review Image'} height={50}
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
                                                )
                                            })
                                            }
                                        </div>
                                    )
                                })
                            }

                            {/*Add Reviews Components Dynamic */}
                            <div className='py-3'>
                                <button className='px-3 py-2 text-white bg-green-500 rounded-lg hover:bg-green-500/80' onClick={() => { setOpenReviewModal(!openReviewModal) }}>Add Review</button>
                                <ReviewModal
                                    onClose={() => setOpenReviewModal(false)}
                                    isVisible={openReviewModal}
                                    reviewedBy={data?._id}
                                    reviewerName={data?.name}
                                    reviewedProduct={product?._id} />
                            </div>
                        </div>
                    </div>
                </div>}
            </section >
            {(isSuccess && isFetched) &&
                <div className='relative'>
                    {(existingRecentlyViewed?.product?.length > 0 && existingRecentlyViewed?.user === data?._id) &&
                        <RecentlyViewedProducts tag={false} products={existingRecentlyViewed?.product} />
                    }
                    <h1 className='absolute top-0 right-0 z-10 p-2 text-white bg-green-500 rounded-tr-xl'>Recently Viewed</h1>
                </div>
            }
        </>
    )
}

export default Product