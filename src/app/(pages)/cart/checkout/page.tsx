"use client"

import Loader from "@/components/Loaders/Loader";
import AddAddressModal from "@/components/Modals/AddAddressModal";
import { discountPercentage } from "@/helpers/discountPercentage";
import { useUserStore } from "@/store/UserStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
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
    const { data }: any = useUserStore();
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
            const response = await axios.get(`../../api/getCart/${cartOwnerId}`);
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
            const seller = await userCart?.cartItems?.map((items: { productId: any; sellerId: any; }) => ({ productId: items?.productId, sellerId: items?.sellerId }));
            const orderDetails = {
                orderName, orderPrice, orderDiscount, quantity, contactNumber, address, pinCode, landMark, orderImage, paymentMethod, paymentStatus, userId, seller, orderConfirmation, productId
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

    const totalMrpPrice = userCart?.cartItems?.reduce((acc: number, item: { price: number; discount: number; quantity: number; }) => {
        return acc + item.price;
    }, 0);

    const totalPrice: number = userCart?.cartItems?.reduce((acc: number, item: { price: number; discount: number; quantity: number; }) => {
        return acc + (item.price - item.discount) * item.quantity
    }, 0);

    const totalDiscount = userCart?.cartItems?.reduce((acc: number, item: { price: number; discount: number; quantity: number; }) => acc + item.discount * item.quantity, 0);

    return (
        <div className='grid grid-cols-[3fr_1fr] py-5 gap-4'>
            <div className='p-5 border dark:border-neutral-700 rounded-xl'>
                <h1 className='pb-5 text-lg font-semibold uppercase text-start'>Order Summary</h1>
                {isPending && <div className='flex items-center justify-center w-full'><Loader title='Loading...' /></div>}
                <div className="grid grid-cols-2 gap-4" >
                    {(!isPending && !isError) &&
                        userCart?.cartItems?.map(({ name, price, image, quantity, discount, sellerName, _id, stock, productId }: cartMappingProps) => {
                            return (
                                <div key={_id} className={`w-full grid grid-cols-[1.5fr_3fr] gap-4 ${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-5`}>
                                    <div className={`${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-3`}>
                                        <Image src={image || "/userProfile.png"} alt={"product-image"} height={200} width={200} className='object-contain w-full rounded-xl h-36' />
                                    </div>

                                    <div className='content-center space-y-3'>
                                        <h1 title={name} className='text-xl font-semibold capitalize line-clamp-1'>{name}</h1>
                                        <h1 className='font-semibold'>
                                            <span className='text-xl'>
                                                ₹ {price - discount}
                                            </span>
                                            <span className='text-gray-500 line-through px-3 '>₹ {price}</span>
                                            <span className='text-green-500'>{Math.round(discountPercentage(price, discount))} % off</span>
                                        </h1>
                                        <div>
                                            <h1 className='text-sm capitalize line-clamp-1'>Seller : 🧑‍🦰 {sellerName}</h1>
                                            <h1 className='text-sm capitalize line-clamp-1'>Store : 🏪 {sellerName}'s Store</h1>
                                            <h1 className='text-sm'>Quantity : {quantity}</h1>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* Address Details */}
                <div className='flex items-center justify-between pt-10'>
                    <div>
                        <h1 className='text-lg font-semibold uppercase text-start '>Delivery Address</h1>
                        <p className='text-sm text-gray-600'>Select your delivery address below</p>
                    </div>
                    <button className='font-semibold capitalize border bg-gray-50 dark:bg-neutral-800 dark:hover:bg-neutral-800/50 hover:bg-gray-100 dark:border-neutral-700 p-2 rounded-lg' onClick={() => { setShowModal(!showModal) }}>🏠 Add Address</button>
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
                                    }} key={_id} className='relative p-5 py-3 my-4 space-y-1 border cursor-pointer dark:border-neutral-700 rounded-xl'>
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
                    <h1 className='text-lg font-semibold uppercase text-start'>Payment Options</h1>
                    <p className='text-sm text-gray-600'>Select a payment type below</p>
                </div>
                <div className='flex items-center justify-between w-full gap-4'>
                    {/* UPI */}
                    <button disabled={select.trim() === ""} className={`p-5 border dark:border-neutral-700 w-full rounded-xl ${select.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"}`} type='button'
                        onClick={() => { setUpiLoading(true); }}>
                        {upiLoading ? <Loader title='Processing...' /> : "UPI"}
                    </button>

                    {/* Credit/Debit Card */}
                    <button disabled={select.trim() === ""} className={`p-5 border dark:border-neutral-700 w-full rounded-xl ${select.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"} `} type='button'
                        onClick={() => { setCardLoading(true); }}>
                        {cardLoading ? <Loader title='Processing...' /> : "Credit / Debit Card"}
                    </button>

                    {/* Cash on Delivery */}
                    <button disabled={select.trim() === ""} onClick={() => { setIsCOD((prev) => !prev) }} className={`p-5 border dark:border-neutral-700 w-full rounded-xl relative ${select.trim() === "" ? "cursor-not-allowed" : "cursor-pointer"}`} type='button'>
                        Cash On Delivery
                        {isCOD && <span className='absolute -right-2 -top-2 bg-white dark:bg-[#1a1a1a] text-green-500'><CheckCircle2 /></span>}
                    </button>
                </div>
                {
                    (isCOD && select.trim() !== "") && <button onClick={handelOrderConfirmation} className='p-3 my-5 text-sm text-white bg-green-500 border rounded-full w-fit hover:bg-green-500/80'>
                        Confirm Order
                    </button>
                }
            </div>

            {/* Grid Second half */}
            <div className='sticky p-5 border dark:border-neutral-700 rounded-xl top-24 h-fit'>
                <h1 className='pb-2 font-semibold uppercase'>Price Details</h1>
                <hr className='my-2 dark:text-neutral-700' />
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
                    <hr className='my-2 dark:text-neutral-700' />
                    <div className='flex items-center justify-between'>
                        <h1>Toatal Payable</h1>
                        <h1>₹{totalPrice?.toLocaleString() || 0}</h1>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CartCeckOut

