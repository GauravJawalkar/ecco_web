"use client";
import StoreHero from '@/components/Stores/StoreHero';
import StoreHeroSkeleton from '@/components/Stores/StoreHeroSkeleton';
import StoreProductsShowcase from '@/components/Stores/StoreShowcase';
import ApiClient from '@/interceptors/ApiClient';
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
            const response = await ApiClient.get(`/api/getPublicStore/${storeId}?page=${page}&limit=${limit}`);
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

    return (
        <>
            {!storeDetails?.publicStore ? (<StoreHeroSkeleton />) : (<StoreHero storeDetails={storeDetails?.publicStore} />)}
            <StoreProductsShowcase
                storeProducts={storeDetails?.storeProducts}
                currentPage={page}
                totalPages={storeDetails?.totalStorePages}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
                loading={isLoading}
            />
        </>
    )
}

export default StorePage