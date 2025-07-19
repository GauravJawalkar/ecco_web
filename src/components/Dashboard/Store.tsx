import { useUserStore } from '@/store/UserStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Edit, Edit2, Edit3 } from 'lucide-react';
import Image from 'next/image'
import React, { useState } from 'react'
import EditStoreDetailsModal from '../Modals/EditStoreDetailsModal';

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

    const { data: StoreData = [] } = useQuery(
        {
            queryKey: ['StoreData', storeId],
            queryFn: fetchStoreData,
            enabled: !!storeId && isStoreLocked === true,
            refetchOnWindowFocus: false,
        }
    )
    return (
        <section className="relative w-full mx-auto rounded-xl my-5">
            {/* Cover Image */}
            <div className="w-full h-48 md:h-64 relative">
                <Image
                    alt="Store Cover"
                    src={StoreData?.[0]?.storeCoverImage || `https://dummyimage.com/640x4:3`}
                    width={1280}
                    height={4080}
                    className="rounded-xl h-full w-full object-cover border dark:border-neutral-700"
                    priority
                />
            </div>
            {/* Profile + Info Row */}
            <div className="flex items-center gap-4 z-10 my-5 relative">
                {/* Profile Image */}
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 bg-white dark:bg-neutral-900">
                    <Image
                        alt="Store Profile"
                        src={StoreData?.[0]?.storeImage || `https://dummyimage.com/qvga`}
                        width={1280}
                        height={1280}
                        className="rounded-full w-full h-full object-cover border border-neutral-300 dark:border-neutral-700"
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
                                <button className="text-blue-500 hover:underline text-sm"
                                    onClick={() => setShowFullDescription((prev) => !prev)}
                                    type="button">
                                    {showFullDescription ? '...less' : '...more'}
                                </button>
                            )}
                    </div>
                    <p className='text-sm'>{totalProducts} Products In Store</p>
                </div>
                <button onClick={() => { setShowEditStoreModal(true) }} title='Edit Store Details' className='absolute top-0 right-2 p-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors'>
                    <Edit3 className='h-5 w-5' />
                </button>
            </div>
            {StoreData?.length > 0 && < EditStoreDetailsModal isOpen={showEditStoreModal} onClose={() => { setShowEditStoreModal(!showEditStoreModal) }} store={{ ...StoreData?.[0] }} />}
        </section >
    )
}

export default Store