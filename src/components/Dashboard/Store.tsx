import { useUserStore } from '@/store/UserStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Edit3, Package } from 'lucide-react';
import Image from 'next/image'
import React, { useState } from 'react'
import EditStoreDetailsModal from '../Modals/EditStoreDetailsModal';
import DashboardStoreHeroSkeleton from '../Skeletons/Dashboard/DashboardStoreHeroSkeleton';

const Store = () => {
    const { data } = useUserStore();
    const storeId = data?._id;
    const isStoreLocked = data?.store;
    const [totalProducts, setTotalProducts] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showEditStoreModal, setShowEditStoreModal] = useState(false);

    async function fetchStoreData() {
        try {
            const response = await axios.get(`/api/getStoreDetails/${storeId}`);
            if (response?.data?.data) {
                setTotalProducts(response.data.totalProducts);
                return response.data?.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching store data:", error);
            return [];
        }
    }

    const { data: StoreData = [], isLoading, isError } = useQuery(
        {
            queryKey: ['StoreData', storeId],
            queryFn: fetchStoreData,
            enabled: !!storeId && isStoreLocked === true,
            refetchOnWindowFocus: false,
        }
    )
    return (
        <>
            {isLoading && (<DashboardStoreHeroSkeleton />)}
            {(!isLoading && !isError) &&
                <section className="relative w-full mx-auto my-5 rounded-xl">
                    {/* Cover Image */}
                    <div className="relative w-full h-48 overflow-hidden md:h-64 rounded-xl">
                        <Image
                            alt="Store Cover"
                            src={`${StoreData?.[0]?.storeCoverImage || "https://dummyimage.com/16:9x1080"}`}
                            fill
                            sizes="100vw"
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                    {/* Profile + Info Row */}
                    <div className="relative z-10 flex items-center gap-4 my-5">
                        {/* Profile Image */}
                        <div className="w-32 h-32 bg-white border-4 border-white rounded-full dark:border-neutral-900 dark:bg-neutral-900">
                            <Image
                                alt="Store Profile"
                                src={`${StoreData?.[0]?.storeImage || "https://dummyimage.com/squarepopup"}`}
                                width={1000}
                                height={1000}
                                className="object-cover w-full h-full border rounded-full border-neutral-300 dark:border-neutral-700"
                                priority
                            />
                        </div>
                        {/* Store Info */}
                        <div className="flex flex-col justify-center space-y-1">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{StoreData?.[0]?.storeName || "Store Name"}</h2>
                            <div>
                                <p className={`text-[15px] text-gray-500 dark:text-gray-400 max-w-lg leading-tight font-normal transition-all ${showFullDescription ? '' : 'line-clamp-2'}`} >
                                    {StoreData?.[0]?.storeDescription ||
                                        "Store description goes here. You can add more info or stats below."}
                                </p>
                                {StoreData?.[0]?.storeDescription &&
                                    StoreData[0].storeDescription.length > 0 && (
                                        <button className="text-sm text-blue-500 hover:underline"
                                            onClick={() => setShowFullDescription((prev) => !prev)}
                                            type="button">
                                            {showFullDescription ? 'Read less' : 'Read more'}
                                        </button>
                                    )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    {totalProducts} Products
                                </span>
                                {/* Add more store stats here if needed */}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 flex items-center gap-2">
                            <div className="flex">
                                <button disabled={!StoreData?.[0]} onClick={() => { setShowEditStoreModal(true) }} title='Edit Store Details' className='flex items-center gap-2 p-2 transition-colors text-sm bg-white border rounded-full right-2 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed text-black/50 hover:text-black dark:text-white/50 hover:dark:text-white'>
                                    <Edit3 className='w-5 h-5' />
                                    Edit Store Details
                                </button>
                            </div>
                        </div>
                    </div>
                    {StoreData?.length > 0 && < EditStoreDetailsModal isOpen={showEditStoreModal} onClose={() => { setShowEditStoreModal(!showEditStoreModal) }} store={{ ...StoreData?.[0] }} />}
                </section>
            }
        </>
    )
}

export default Store