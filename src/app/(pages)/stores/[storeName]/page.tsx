import StoreHero from '@/components/Stores/StoreHero';
import StoreProductsShowcase from '@/components/Stores/StoreShowcase';
import React from 'react'

type Props = {
    params: { storeName: string };
};



const StorePage = async ({ params }: Props) => {
    // const { storeName } = await params; // Not needed for dummy UI

    return (
        <>
            <StoreHero />
            <StoreProductsShowcase />
        </>
    )
}

export default StorePage