"use client";
import StoreHero from '@/components/Stores/StoreHero';
import StoreProductsShowcase from '@/components/Stores/StoreShowcase';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React from 'react'

const StorePage = () => {
    const searchParams = useSearchParams();
    const storeId = searchParams.get('id');

    const getStoreDetails = async () => {
        try {
            const response = await axios.get(`/api/getPublicStore/${storeId}`);
            if (response.status === 200) {
                return response.data?.data
            }
            return [];
        } catch (error) {
            console.error("Error fetching store details:", error);
        }
    }

    const { data: storeDetails = [] } = useQuery(
        {
            queryFn: getStoreDetails,
            queryKey: ['StoreDetails', storeId],
            refetchOnWindowFocus: false,
        });

    console.log("Store Details:", storeDetails);

    return (
        <>
            <StoreHero storeDetails={storeDetails?.publicStore} />
            <StoreProductsShowcase storeProducts={storeDetails?.storeProducts}  />
        </>
    )
}

export default StorePage