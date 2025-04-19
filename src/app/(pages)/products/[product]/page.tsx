"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react'


const Product = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    async function getSpecificProduct(id: string) {
        try {
            const response = await axios.get(`../api/getProductDetails/${id}`)

            if (response.data.data) {
                return response.data.data
            }
            return []
        } catch (error) {
            console.log("Error getting the product : ", error);
            return []
        }
    }

    const { data: product = [] } = useQuery({ queryFn: () => getSpecificProduct(id as string), queryKey: ['product'] })
    return (
        <>
            <div>Single Product is :{product.name}</div>
            {
                product.images?.map((image: string, index: number) => {
                    return (
                        <Image key={index} src={image} alt='product-image' height={400} width={400} />
                    )
                })
            }
        </>
    )
}

export default Product