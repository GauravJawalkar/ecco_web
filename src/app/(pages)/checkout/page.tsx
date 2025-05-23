"use client"
import Loader from '@/components/Loaders/Loader';
import AddAddressModal from '@/components/Modals/AddAddressModal';
import { discountPercentage } from '@/helpers/discountPercentage';
import { useUserStore } from '@/store/UserStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BadgeCheck, Check, CheckCircle2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const page = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [landMark, setLandMark] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [select, setSelect] = useState("");
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
    })

    const { data: sellerDetails = [] } = useQuery(
        {
            queryKey: ['sellerDetails'],
            queryFn: () => getSellerDetails(productDetails?.seller),
            enabled: !!productDetails?.seller,
        }
    )

    const { data: userAddresses } = useQuery({
        queryKey: ['userAddresses'],
        queryFn: () => getUserAddress(),
        enabled: !!userId,
        refetchOnWindowFocus: false
    })


    return (
        <div className='grid grid-cols-[3fr_1fr] my-5 gap-4'>

            <div className='p-5 border dark:border-neutral-700 rounded-xl'>
                <h1 className='py-5 uppercase font-semibold text-start text-lg'>Order Summary</h1>
                {isPending && <div className='flex items-center justify-center w-full'><Loader title='Loading...' /></div>}
                <div className={`w-full grid grid-cols-[1fr_3fr] gap-4 ${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-5`}>
                    {(!isPending && !isError) &&
                        <>
                            <div className={`${isPending ? "border-none" : "border"} dark:border-neutral-700 rounded-xl p-3`}>
                                <Image src={productDetails?.images?.[0] || "/userProfile.png"} alt={"product-image"} height={200} width={200} className='rounded-xl h-36 w-full object-contain' />
                                <div className='flex items-center justify-center gap-3'>
                                    <button className='p-2 border dark:border-neutral-700 rounded-full'><Minus className='h-4 w-4' /></button>
                                    <span>{quantity}</span>
                                    <button className='p-2 border dark:border-neutral-700 rounded-full'><Plus className='h-4 w-4' /></button>
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
                <div className='flex items-center justify-between pt-5 '>
                    <h1 className='uppercase font-semibold text-start text-lg'>Delivery Address</h1>
                    <button className='uppercase hover:font-semibold hover:text-gray-700' onClick={() => { setShowModal(!showModal) }}>🏠 New Address</button>
                </div>
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
            </div >

            {/* Grid Second half */}
            <div>
                Price Details
            </div >
        </div >
    )
}

export default page