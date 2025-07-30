"use client";
import StoreHero from '@/components/Stores/StoreHero';
import StoreProductsShowcase from '@/components/Stores/StoreShowcase';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const StorePage = () => {
    const searchParams = useSearchParams();
    const storeId = searchParams.get('id');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10)

    const getStoreDetails = async () => {
        try {
            const response = await axios.get(`/api/getPublicStore/${storeId}?page=${page}&limit=${limit}`);
            if (response.status === 200) {
                return response.data?.data
            }
            return [];
        } catch (error) {
            console.error("Error fetching store details:", error);
        }
    }

    const { data: storeDetails = [], isLoading } = useQuery(
        {
            queryFn: getStoreDetails,
            queryKey: ['StoreDetails', storeId, page, limit],
            refetchOnWindowFocus: false,
        });

    console.log("Store Details:", storeDetails);

    return (
        <>
            <StoreHero storeDetails={storeDetails?.publicStore} />
            <StoreProductsShowcase storeProducts={storeDetails?.storeProducts} currentPage={page} totalPages={storeDetails?.totalStorePages} limit={limit} onPageChange={setPage} onLimitChange={setLimit} loading={isLoading} />
        </>
    )
}

export default StorePage