'use client';

import Loader from '@/components/Loaders/Loader';
import AddAddressModal from '@/components/Modals/AddAddressModal';
import { discountPercentage } from '@/helpers/discountPercentage';
import ApiClient from '@/interceptors/ApiClient';
import { userProps } from '@/interfaces/commonInterfaces';
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CheckoutContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState("");
    const [orderImage, setOrderImage] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [landMark, setLandMark] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [select, setSelect] = useState("");
    const [isCOD, setIsCOD] = useState(false);
    const [upiLoading, setUpiLoading] = useState(false);
    const [cardLoading, setCardLoading] = useState(false);
    const { data }: { data: userProps } = useUserStore();
    const userId = data?._id;

    if (!id) {
        router.back();
        return null;
    }

    async function getProductDetails(id: string) {
        try {
            const response = await ApiClient.get(`/api/getProductDetails/${id}`);
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error getting the products : ", error);
            return [];
        }
    }

    async function getSellerDetails(id: string) {
        try {
            const response = await ApiClient.get(`/api/getSelletDetails/${id}`);
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error getting seller Details : ", error);
            return []
        }
    }

    async function getUserAddress() {
        try {
            const response = await ApiClient.get(`/api/getAddress/${userId}`);
            if (response.data.data) {
                return response.data.data
            }
            return []
        } catch (error) {
            console.error("Failed to get the user Addresses", error);
            return [];
        }
    }

    const { data: productDetails = [], isPending, isError } = useQuery({
        queryFn: async () => await getProductDetails(id as string),
        queryKey: ['productDetails'],
        enabled: !!id,
        refetchOnWindowFocus: false
    })

    const { data: sellerDetails = [] } = useQuery(
        {
            queryKey: ['sellerDetails'],
            queryFn: () => getSellerDetails(productDetails?.seller),
            enabled: !!productDetails?.seller,
            refetchOnWindowFocus: false
        }
    )

    const { data: userAddresses, isLoading } = useQuery({
        queryKey: ['userAddresses'],
        queryFn: () => getUserAddress(),
        enabled: !!userId,
        refetchOnWindowFocus: false
    })

    const handlePayment = async () => {
        try {
            const orderAmount = (productDetails.price - productDetails.discount) * quantity;

            // Create order with commission details
            const { data: order } = await ApiClient.post('/api/razorpay/order', {
                amount: orderAmount,
                sellerId: sellerDetails?._id,
            });

            // Check if Razorpay is already loaded
            if (!(window as any).Razorpay) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: `${sellerDetails.name}'s Store`,
                description: `Payment for ${productDetails.name}`,
                order_id: order.orderId,

                handler: async (response: any) => {
                    try {
                        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                            throw new Error("Incomplete payment response from Razorpay");
                        }
                        // Verify payment
                        const { data: verifyData } = await ApiClient.post('/api/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyData.success) {
                            const orderDetails = {
                                orderName: productDetails.name,
                                orderPrice: productDetails.price,
                                orderDiscount: productDetails.discount,
                                quantity,
                                contactNumber,
                                address,
                                pinCode,
                                landMark,
                                orderImage,
                                paymentMethod: "Online",
                                paymentStatus: "Done",
                                userId,
                                sellerId: sellerDetails._id,
                                productId: productDetails._id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                commission: orderAmount * 0.02,
                                sellerAmount: orderAmount * 0.98,
                            };

                            await ApiClient.post('/api/createOrder', { orderDetails });
                            toast.success('Payment successful! Commission deducted');
                            router.push('/orders');
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error: any) {
                        console.error('Payment processing error:', error);
                        toast.error(error.response?.data?.error || 'Payment processing failed');
                    } finally {
                        setUpiLoading(false);
                        setCardLoading(false);
                    }
                },
                prefill: {
                    name: data?.name,
                    email: data?.email,
                    contact: contactNumber,
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', (response: any) => {
                toast.error(`Payment failed: ${response.error.description}`);
                setUpiLoading(false);
                setCardLoading(false);
            });

            rzp.open();
            setUpiLoading(false);
            setCardLoading(false);
        } catch (error: any) {
            console.error('Payment initiation error:', error);
            toast.error(error.response?.data?.error || 'Payment failed to initiate');
            setUpiLoading(false);
            setCardLoading(false);
        }
    };

    async function createOrder() {
        try {
            const productId = [productDetails?._id];
            const orderName = productDetails?.name;
            const orderPrice = productDetails?.price;
            const orderDiscount = productDetails?.discount;
            const paymentStatus = "Pending";
            const paymentMethod = "COD";
            const sellerId = sellerDetails?._id;
            const seller = [{ productId: productDetails?._id, sellerId: sellerDetails?._id }]
            const orderConfirmation = "Order Confirmed";
            const orderDetails = {
                orderName, orderPrice, orderDiscount, quantity, contactNumber, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId, sellerId, orderConfirmation, productId, seller
            };
            const response = await ApiClient.post("/api/createOrder", { orderDetails });
            if (response.data.data) {
                toast.success('Order Confirmed');
            }
            return [];
        } catch (error) {
            console.error("Error creating the order : ", error);
            return [];
        }
    }

    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            toast.success('Order Placed Successfully');
            router.push('/orders');
        }
    })

    const handelOrderConfirmation = (e: React.MouseEvent) => {
        e.preventDefault();
        createOrderMutation.mutate();
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] px-4 sm:px-6 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto pb-24 md:pb-10 gap-4 sm:gap-6'>

            <div className='p-4 sm:p-5 border dark:border-neutral-700 rounded-xl'>
                <h1 className='pb-5 text-lg font-semibold uppercase text-start'>Order Summary</h1>
                {isPending && <div className='flex items-center justify-center w-full'><Loader title='Loading...' /></div>}
                <div className={`w-full flex flex-col sm:flex-row gap-4 sm:gap-6 ${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-4 sm:p-5`}>
                    {(!isPending && !isError) &&
                        <>
                            <div className={`flex flex-col items-center gap-4 flex-shrink-0 ${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-3 sm:p-4 w-full sm:w-auto`}>
                                <Image src={productDetails?.images?.[0] || "/userProfile.png"} alt={"product-image"} height={160} width={160} className='object-contain w-32 h-32 sm:w-40 sm:h-40 rounded-lg' />
                                <div className='flex items-center justify-center gap-2 sm:gap-3 w-full'>
                                    <button disabled={quantity <= 1} onClick={() => { setQuantity(quantity - 1) }} className='flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 border rounded-full dark:border-neutral-700 min-h-[40px] min-w-[40px] sm:min-h-0 sm:min-w-0 touch-manipulation hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors'><Minus className='w-4 h-4' /></button>
                                    <span className="w-8 text-center font-medium">{quantity}</span>
                                    <button onClick={() => { setQuantity(quantity + 1) }} className='flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 border rounded-full dark:border-neutral-700 min-h-[40px] min-w-[40px] sm:min-h-0 sm:min-w-0 touch-manipulation hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'><Plus className='w-4 h-4' /></button>
                                </div>
                            </div>

                            <div className='flex-1 flex flex-col justify-center space-y-2 sm:space-y-3'>
                                <h1 className='text-base sm:text-xl font-medium text-gray-900 dark:text-white capitalize line-clamp-2'>{productDetails?.name}</h1>
                                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3'>{productDetails?.description}</p>
                                <div className='flex flex-wrap items-baseline gap-2'>
                                    <span className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
                                        ₹ {(productDetails?.price - productDetails?.discount)?.toLocaleString()}
                                    </span>
                                    {productDetails?.discount > 0 && <span className='text-xs sm:text-sm text-gray-500 line-through'>₹ {productDetails?.price?.toLocaleString()}</span>}
                                    {productDetails?.discount > 0 && <span className='text-xs sm:text-sm font-medium text-green-600 dark:text-green-500'>{Math.round(discountPercentage(productDetails?.price, productDetails?.discount))}% off</span>}
                                </div>
                                <div className="space-y-0.5 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    <p className='capitalize'>Seller: <span className="font-medium text-gray-700 dark:text-gray-300">{sellerDetails?.name}</span></p>
                                    <p className='capitalize'>Store: <span className="font-medium text-gray-700 dark:text-gray-300">{sellerDetails?.name}'s Store</span></p>
                                </div>
                            </div>
                        </>
                    }
                </div>

                {/* Address Details */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 sm:pt-10 gap-4 sm:gap-0'>
                    <div>
                        <h1 className='text-base sm:text-lg font-semibold uppercase text-start '>Delivery Address</h1>
                        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0'>Select your delivery address below</p>
                    </div>
                    <button className='w-full sm:w-auto font-medium capitalize border bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700 hover:bg-gray-50 dark:border-neutral-700 px-4 py-2.5 rounded-xl sm:rounded-lg text-sm transition-colors min-h-[44px] touch-manipulation flex items-center justify-center gap-2 shadow-sm' onClick={() => { setShowModal(!showModal) }}>
                        <span>🏠</span> Add Address
                    </button>
                </div>
                <div className='w-full'>
                    <div>
                        {isLoading && <div className='flex items-center justify-center'><Loader title='Loading...' /></div>}
                        {userAddresses === "No Addresses Found" && <h1 className='text-base text-center py-5 my-2 border dark:border-neutral-700 rounded-xl capitalize'>No Addresses Saved</h1>}
                        {
                            userAddresses?.[0].addresses?.map(({ _id, mainAddress, pinCode, landMark, contactNumber }: any) => {
                                return (
                                    <div onClick={() => {
                                        setSelect(_id);
                                        setAddress(mainAddress);
                                        setPinCode(pinCode);
                                        setLandMark(landMark);
                                        setContactNumber(contactNumber);
                                        setOrderImage(productDetails?.images?.[0]);
                                    }} key={_id} className={`relative p-5 py-3 my-4 space-y-1 cursor-pointer rounded-xl transition-colors ${select === _id ? "border-2 border-green-500 dark:border-green-500/50 bg-green-50 dark:bg-green-900/10" : "border-2 border-dashed dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}>
                                        <h1 title='main address of street city village'>🗺️ : {mainAddress}</h1>
                                        <h1 title='pincode of the area'>📍 : {pinCode}</h1>
                                        <h1 title='landmark of the area'>🌍 : {landMark}</h1>
                                        <h1 title='contact phone number'>📱 : {contactNumber}</h1>
                                        {select === _id && <span className='absolute -right-2 -top-3 bg-white dark:bg-[#1a1a1a] text-green-500 rounded-full'>
                                            <CheckCircle2 className='w-5 h-5 sm:w-6 sm:h-6' />
                                        </span>}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <AddAddressModal isVisible={showModal} onClose={() => { setShowModal(false) }} />
                </div>

                <div className='py-5 '>
                    <h1 className='text-lg font-semibold uppercase text-start'>Payment Options</h1>
                    <p className='text-sm text-gray-600'>Select a payment type below</p>
                </div>
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3 sm:gap-4 mt-4'>
                    {/* UPI */}
                    <button disabled={select.trim() === ""} className={`p-4 sm:p-5 border-2 border-dashed dark:border-neutral-700 w-full rounded-xl min-h-[44px] touch-manipulation transition-colors ${select.trim() === "" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"}`} type='button'
                        onClick={() => { setUpiLoading(true); handlePayment(); }}>
                        {upiLoading ? <Loader title='Processing...' /> : "UPI"}
                    </button>

                    {/* Credit/Debit Card */}
                    <button disabled={select.trim() === ""} className={`p-4 sm:p-5 border-2 border-dashed dark:border-neutral-700 w-full rounded-xl min-h-[44px] touch-manipulation transition-colors ${select.trim() === "" ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"} `} type='button'
                        onClick={() => { setCardLoading(true); handlePayment(); }}>
                        {cardLoading ? <Loader title='Processing...' /> : "Credit / Debit Card"}
                    </button>

                    {/* Cash on Delivery */}
                    <button disabled={select.trim() === ""} onClick={() => { setIsCOD((prev) => !prev) }} className={`p-4 sm:p-5 w-full rounded-xl relative min-h-[44px] touch-manipulation transition-colors ${select.trim() === "" ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${isCOD ? "border-2   border-green-500 dark:border-green-500/50 bg-green-50 dark:bg-green-900/10" : "border-2 border-dashed dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"} `} type='button'>
                        Cash On Delivery
                        {isCOD && <span className='absolute -right-2 -top-2 bg-white dark:bg-[#1a1a1a] text-green-500 rounded-full'><CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /></span>}
                    </button>
                </div>
            </div>

            {/* Grid Second half */}
            <div className='sticky p-5 border dark:border-neutral-700 rounded-xl top-24 h-fit'>
                <h1 className='pb-2 font-semibold uppercase'>Price Details</h1>
                <hr className='my-2 dark:border-neutral-700' />
                <div className='py-4 space-y-5'>
                    <div className='flex items-center justify-between'>
                        <h1>Price ({quantity} item)</h1>
                        <p>₹{(productDetails?.price - productDetails?.discount) * quantity || 0}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <h1>Platform Fee</h1>
                        <p>₹ 0.0</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <h1>Delivery Charges</h1>
                        <h1>Free</h1>
                    </div>
                    <hr className='my-2 dark:border-neutral-700' />
                    <div className='flex items-center justify-between'>
                        <h1>Toatal Payable</h1>
                        <h1>₹{((productDetails?.price - productDetails?.discount) * quantity)?.toLocaleString() || 0}</h1>
                    </div>
                </div>
                {
                    (isCOD && select.trim() !== "") && <button onClick={handelOrderConfirmation} className='w-full px-8 py-3 sm:py-2.5 my-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-full hover:bg-green-700 touch-manipulation shadow-sm'>
                        Confirm Order
                    </button>
                }
            </div>
        </div>
    )
}

export default CheckoutContent