"use client"
import Loader from '@/components/Loaders/Loader';
import AddAddressModal from '@/components/Modals/AddAddressModal';
import { discountPercentage } from '@/helpers/discountPercentage';
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BadgeCheck, Check, CheckCircle2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const page = () => {
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
    const { data }: any = useUserStore();
    const userId = data?._id;


    if (!id) {
        return router.back();
    }

    async function getProductDetails(id: string) {
        try {
            const response = await axios.get(`/api/getProductDetails/${id}`);
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

    async function getUserAddress() {
        try {
            const response = await axios.get(`/api/getAddress/${userId}`);
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

    const { data: userAddresses } = useQuery({
        queryKey: ['userAddresses'],
        queryFn: () => getUserAddress(),
        enabled: !!userId,
        refetchOnWindowFocus: false
    })


    const handlePayment = async () => {

        try {
            // Create Razorpay order
            const { data: order } = await axios.post('/api/razorpay/order', {
                amount: ((productDetails?.price - productDetails?.discount) * quantity),
                receipt: 'reciept-001',
            });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: `${sellerDetails?.name}'s Store`,
                description: 'Test Transaction',
                order_id: order.id,
                handler: async function (response: any) {
                    // Verify payment signature
                    const { data: verifyData } = await axios.post('/api/razorpay/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verifyData.success) {
                        toast.success('✅ Payment successful and verified!');
                        const orderName = productDetails?.name;
                        const orderPrice = productDetails?.price;
                        const orderDiscount = productDetails?.discount;
                        const paymentStatus = "Done";
                        const paymentMethod = "Online";
                        const sellerId = sellerDetails?._id;
                        const orderDetails = {
                            orderName, orderPrice, orderDiscount, quantity, contactNumber, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId, sellerId
                        };
                        const response = await axios.post("/api/createOrder", { orderDetails });
                        if (response.data.data) {
                            toast.success('✅ Ordered! Check Orders');
                            router.push('/orders');
                        }
                        return [];
                    } else {
                        toast.error('❌ Payment verification failed.');
                    }
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razor = new (window as any).Razorpay(options);
            razor.open();
            setUpiLoading(false);
            setCardLoading(false);
        } catch (err) {
            console.error('Error in Razorpay flow:', err);
            toast.error('Payment failed to initiate.');
            setUpiLoading(false);
            setCardLoading(false);
        }

    };

    // RazorPay UseEffect for their payment UI portal and Scripts
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);


    async function createOrder() {
        try {
            const orderName = productDetails?.name;
            const orderPrice = productDetails?.price;
            const orderDiscount = productDetails?.discount;
            const paymentStatus = "COD";
            const paymentMethod = "COD";
            const sellerId = sellerDetails?._id;
            const orderDetails = {
                orderName, orderPrice, orderDiscount, quantity, contactNumber, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId, sellerId
            };
            const response = await axios.post("/api/createOrder", { orderDetails });
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

    return (
        <div className='grid grid-cols-[3fr_1fr] py-5 gap-4'>

            <div className='p-5 border dark:border-neutral-700 rounded-xl'>
                <h1 className='pb-5 uppercase font-semibold text-start text-lg'>Order Summary</h1>
                {isPending && <div className='flex items-center justify-center w-full'><Loader title='Loading...' /></div>}
                <div className={`w-full grid grid-cols-[1fr_3fr] gap-4 ${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-5`}>
                    {(!isPending && !isError) &&
                        <>
                            <div className={`${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-3`}>
                                <Image src={productDetails?.images?.[0] || "/userProfile.png"} alt={"product-image"} height={200} width={200} className='rounded-xl h-36 w-full object-contain' />
                                <div className='flex items-center justify-center gap-3'>
                                    <button disabled={quantity <= 1} onClick={() => { setQuantity(quantity - 1) }} className='p-2 border dark:border-neutral-700 rounded-full'><Minus className='h-4 w-4' /></button>
                                    <span>{quantity}</span>
                                    <button onClick={() => { setQuantity(quantity + 1) }} className='p-2 border dark:border-neutral-700 rounded-full'><Plus className='h-4 w-4' /></button>
                                </div>
                            </div>

                            <div className='space-y-3 content-center'>
                                <h1 className='capitalize text-xl font-semibold line-clamp-2'>{productDetails?.name}</h1>
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
                        </>
                    }
                </div>

                {/* Address Details */}
                <div className='flex items-center justify-between pt-10'>
                    <div>
                        <h1 className='uppercase font-semibold text-start text-lg '>Delivery Address</h1>
                        <p className='text-sm text-gray-600'>Select your delivery address below</p>
                    </div>
                    <button className='uppercase font-semibold hover:text-gray-700' onClick={() => { setShowModal(!showModal) }}>🏠 New Address</button>
                </div>
                {isPending && <div className='flex items-center justify-center w-full'><Loader title='Fetching...' /></div>}
                <div className='w-full'>
                    <div>
                        {userAddresses?.[0].addresses?.length <= 0 && <h1 className='capitalize text-xl font-semibold'>No Addresses Saved. Add One</h1>}
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
                                    }} key={_id} className='space-y-1 py-3 border dark:border-neutral-700 p-5 rounded-xl my-4 cursor-pointer relative'>
                                        <h1 title='main address of street city village'>🗺️ : {mainAddress}</h1>
                                        <h1 title='pincode of the area'>📍 : {pinCode}</h1>
                                        <h1 title='landmark of the area'>🌍 : {landMark}</h1>
                                        <h1 title='contact phone number'>📱 : {contactNumber}</h1>
                                        {select === _id && <div className='absolute -right-1 -top-4'>
                                            <CheckCircle2 className='text-green-500 h-7 w-7 bg-white dark:bg-[#1a1a1a]' />
                                        </div>}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <AddAddressModal isVisible={showModal} onClose={() => { setShowModal(false) }} />
                </div>

                <div className='py-5 '>
                    <h1 className='uppercase font-semibold text-start text-lg'>Payment Options</h1>
                    <p className='text-sm text-gray-600'>Select a payment type below</p>
                </div>
                <div className='w-full flex items-center justify-between gap-4'>
                    {/* UPI */}
                    <button disabled={select.trim() === ""} className={`p-5 border dark:border-neutral-700 w-full rounded-xl ${select.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"}`} type='button'
                        onClick={() => { setUpiLoading(true); handlePayment(); }}>
                        {upiLoading ? <Loader title='Processing...' /> : "UPI"}
                    </button>

                    {/* Credit/Debit Card */}
                    <button disabled={select.trim() === ""} className={`p-5 border dark:border-neutral-700 w-full rounded-xl ${select.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"} `} type='button'
                        onClick={() => { setCardLoading(true); handlePayment(); }}>
                        {cardLoading ? <Loader title='Processing...' /> : "Credit / Debit Card"}
                    </button>

                    {/* Cash on Delivery */}
                    <button disabled={select.trim() === ""} onClick={() => { setIsCOD((prev) => !prev) }} className={`p-5 border dark:border-neutral-700 w-full rounded-xl relative ${select.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"}`} type='button'>
                        Cash On Delivery
                        {isCOD && <span className='absolute -right-2 -top-2 bg-white dark:bg-[#1a1a1a] text-green-500'><CheckCircle2 /></span>}
                    </button>
                </div>
                {(isCOD && select.trim() !== "") && <button onClick={handelOrderConfirmation} className='my-5 border p-3 w-fit rounded-full text-sm bg-green-500 text-white hover:bg-green-500/80'>
                    Confirm Order
                </button>}
            </div>

            {/* Grid Second half */}
            <div className='border dark:border-neutral-700 p-5 rounded-xl sticky top-24 h-fit'>
                <h1 className='uppercase font-semibold pb-2'>Price Details</h1>
                <hr className='my-2 dark:text-neutral-700' />
                <div className='space-y-5 py-4'>
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
                    <hr className='my-2 dark:text-neutral-700' />
                    <div className='flex items-center justify-between'>
                        <h1>Toatal Payable</h1>
                        <h1>₹{(productDetails?.price - productDetails?.discount) * quantity || 0}</h1>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default page