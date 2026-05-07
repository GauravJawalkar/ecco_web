"use client"

import Loader from "@/components/Loaders/Loader";
import AddAddressModal from "@/components/Modals/AddAddressModal";
import { discountPercentage } from "@/helpers/discountPercentage";
import ApiClient from "@/interceptors/ApiClient";
import { userProps } from "@/interfaces/commonInterfaces";
import { useUserStore } from "@/store/UserStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface cartMappingProps {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
    discount: number;
    sellerName: string;
    productId: string
}

const CartCeckOut = () => {
    const { data }: { data: userProps } = useUserStore();
    const cartOwnerId = data?._id;
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState("");
    const [orderImage, setOrderImage] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [landMark, setLandMark] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [select, setSelect] = useState("");
    const [isCOD, setIsCOD] = useState(false);
    const [upiLoading, setUpiLoading] = useState(false);
    const [cardLoading, setCardLoading] = useState(false);
    const router = useRouter();

    async function getCartItems() {
        try {
            const response = await ApiClient.get(`/api/getCart/${cartOwnerId}`);
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error getting the cart details :", error);
            return [];
        }
    }

    async function getUserAddress() {
        const userId = data?._id;
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

    const { data: userAddresses, isLoading } = useQuery({
        queryKey: ['userAddresses'],
        queryFn: () => getUserAddress(),
        enabled: !!cartOwnerId,
        refetchOnWindowFocus: false
    })

    const { data: userCart = [], isPending, isError } = useQuery({
        queryFn: getCartItems,
        queryKey: ["userCart", cartOwnerId],
        enabled: !!cartOwnerId,
        refetchOnWindowFocus: false,
    });

    async function createOrder() {
        try {
            const productId = await userCart?.cartItems?.map((item: { productId: string }) => item?.productId);
            const orderName = `Cart Order`;
            const orderPrice = totalMrpPrice;
            const orderDiscount = totalDiscount;
            const paymentStatus = "Pending";
            const paymentMethod = "COD";
            const userId = data?._id;
            const quantity = await userCart?.cartItems?.length;
            const orderConfirmation = "Order Confirmed";
            const seller = await userCart?.cartItems?.map((items: { productId: string; sellerId: string; }) => ({ productId: items?.productId, sellerId: items?.sellerId }));
            const orderDetails = {
                orderName, orderPrice, orderDiscount, quantity, contactNumber, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId, seller, orderConfirmation, productId
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
            router.push('/orders');
        }
    })

    const handelOrderConfirmation = (e: React.MouseEvent) => {
        e.preventDefault();
        createOrderMutation.mutate();
    }

    const totalMrpPrice = userCart?.cartItems?.reduce((acc: number, item: { price: number; discount: number; quantity: number; }) => {
        return acc + item.price;
    }, 0);

    const totalPrice: number = userCart?.cartItems?.reduce((acc: number, item: { price: number; discount: number; quantity: number; }) => {
        return acc + (item.price - item.discount) * item.quantity
    }, 0);

    const totalDiscount = userCart?.cartItems?.reduce((acc: number, item: { price: number; discount: number; quantity: number; }) => acc + item.discount * item.quantity, 0);

    const handlePayment = async () => {
        try {
            const orderAmount = totalPrice;

            // Create order with commission details
            const { data: order } = await ApiClient.post('/api/razorpay/order', {
                amount: orderAmount,
                sellerId: userCart?.cartItems?.map((item: { sellerId: string }) => item?.sellerId),
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
                name: `Full Cart Order`,
                description: `Payment for ${data?.name}'s full cart order`,
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
                                orderName: userCart?.cartItems?.map((items: { name: string }) => items?.name),
                                orderPrice: totalMrpPrice,
                                orderDiscount: totalMrpPrice,
                                quantity: 1,
                                contactNumber,
                                address,
                                pinCode,
                                landMark,
                                orderImage,
                                paymentMethod: "Online",
                                paymentStatus: "Done",
                                userId: data?._id,
                                sellerId: await userCart?.cartItems?.map((item: { sellerId: string }) => item?.sellerId),
                                productId: await userCart?.cartItems?.map((item: { productId: string }) => item?.productId),
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

    return (
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_1fr] px-4 sm:px-6 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto pb-24 md:pb-10 gap-4 sm:gap-6'>
            <div className='p-4 sm:p-5 border dark:border-neutral-700 rounded-xl'>
                <h1 className='pb-5 text-lg font-semibold uppercase text-start'>Order Summary</h1>
                {isPending && <div className='flex items-center justify-center w-full'><Loader title='Loading...' /></div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                    {(!isPending && !isError) &&
                        userCart?.cartItems?.map(({ name, price, image, quantity, discount, sellerName, _id, stock, productId }: cartMappingProps) => {
                            return (
                                <div key={_id} className={`w-full flex gap-3 sm:gap-4 ${isPending ? "border-none" : "border"} dark:border-neutral-700 dark:bg-neutral-800/50 rounded-xl p-3 sm:p-4`}>
                                    <div className={`flex-shrink-0 ${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-2`}>
                                        <Image src={image || "/userProfile.png"} alt={"product-image"} height={120} width={120} className='object-contain w-20 h-20 sm:w-24 sm:h-24 rounded-lg' />
                                    </div>

                                    <div className='flex-1 flex flex-col justify-center space-y-1'>
                                        <h1 title={name} className='text-sm sm:text-base font-medium text-gray-800 dark:text-neutral-100 capitalize line-clamp-2'>{name}</h1>
                                        <div className='mt-1 space-y-0.5 sm:space-y-1 text-xs sm:text-sm'>
                                            <p className='text-gray-600 dark:text-neutral-300'>
                                                <span className='font-bold text-gray-900 dark:text-white text-sm sm:text-base'>
                                                    ₹ {(price - discount)?.toLocaleString()}
                                                </span>
                                                {discount > 0 && <span className='ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-gray-400 line-through'>₹ {price?.toLocaleString()}</span>}
                                                {discount > 0 && <span className='ml-1.5 sm:ml-2 text-green-600 dark:text-green-500 text-[10px] sm:text-xs font-medium'>{Math.round(discountPercentage(price, discount))}% off</span>}
                                            </p>
                                            <p className='text-gray-500 dark:text-neutral-400 capitalize line-clamp-1'>Seller: {sellerName}</p>
                                            <p className='text-gray-500 dark:text-neutral-400'>Quantity: {quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* Address Details */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 sm:pt-10 gap-4 sm:gap-0'>
                    <div>
                        <h1 className='text-base sm:text-lg font-semibold uppercase text-start'>Delivery Address</h1>
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
                                        setOrderImage(userCart?.cartItems?.[0]?.image);
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
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Select a payment type below</p>
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
                    <button disabled={select.trim() === ""} onClick={() => { setIsCOD((prev) => !prev) }} className={`p-4 sm:p-5 dark:border-neutral-700 w-full rounded-xl relative min-h-[44px] touch-manipulation transition-colors ${select.trim() === "" ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${isCOD ? "border-2 border-green-500 dark:border-green-500/50 bg-green-50 dark:bg-green-900/10" : "border-2 border-dashed dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"} `} type='button'>
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
                        <h1>Price ({userCart?.cartItems?.length || 0} Items)</h1>
                        <p>₹{totalPrice}</p>
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
                        <h1>Total Payable</h1>
                        <h1>₹{totalPrice?.toLocaleString() || 0}</h1>
                    </div>
                </div>
                {
                    (isCOD && select.trim() !== "") && <button onClick={handelOrderConfirmation} className='w-full sm:w-full px-8 py-3 sm:py-2 my-1 text-sm font-medium text-white transition-colors bg-green-600 rounded-full hover:bg-green-700 touch-manipulation shadow-sm'>
                        Confirm Order
                    </button>
                }
            </div>
        </div>
    )
}

export default CartCeckOut

