"use client"
import Loader from '@/components/Loaders/Loader';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { use, useEffect } from 'react'
import toast from 'react-hot-toast';
interface searchParams {
    category?: string | "";
}

interface productsProps {
    _id: string,
    name: string,
    description: string,
    images: [string],
    price: number,
    discount: number,
    stock: number,
    size: number,
    seller: string
}

const ProductsPage = ({ searchParams }: any) => {
    const searchParamsData: searchParams = use(searchParams);
    const category = searchParamsData?.category;

    async function getFilteredData(category: string) {
        try {
            const response = await axios.post('/api/filteredProducts', { category });
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error getting the filtered data : ", error);
            toast.error("Error getting the filtered data");
            return [];
        }
    }

    const filterProductMutation = () => {
        return useMutation({
            mutationFn: (category: string) => getFilteredData(category),
        })
    }

    const { mutate, data: products, isPending, isError } = filterProductMutation();

    if (category?.trim() !== "") {
        useEffect(() => {
            if (category) {
                mutate(category);
            }
        }, [category, mutate]);
    }

    { isError && <div>Failed to fetch products</div> }

    async function getAllProducts() {
        try {
            const response = await axios.get('/api/getAllProducts');
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error getting all the products ", error)
            return []
        }
    }

    const { data: allProducts = [] } = useQuery({
        queryFn: getAllProducts,
        queryKey: ['allProducts']
    });

    return (
        <>
            {(products && products.length === 0) && <div>No Products Found</div>}
            {isPending && <div><Loader title='Loading...' /></div>}
            {
                products?.map(({ _id, name, description, images, price, discount, stock, size, seller }: productsProps) => {
                    return (
                        <div key={_id}>
                            <h1>{_id}</h1>
                            <h1>{name}</h1>
                            <h1>{description}</h1>
                            <h1>{images[0]}</h1>
                            <h1>{price}</h1>
                            <h1>{discount}</h1>
                            <h1>{stock}</h1>
                            <h1>{size}</h1>
                            <h1>{seller}</h1>
                            <br />
                            <br />
                            <br />
                            <br />
                        </div>

                    )
                })
            }

            {!category && allProducts?.map(({ _id, name, description, images, price, discount, stock, size, seller }: productsProps) => {
                return (
                    <div key={_id}>
                        <h1>{_id}</h1>
                        <h1>{name}</h1>
                        <h1>{description}</h1>
                        <h1>{images[0]}</h1>
                        <h1>{price}</h1>
                        <h1>{discount}</h1>
                        <h1>{stock}</h1>
                        <h1>{size}</h1>
                        <h1>{seller}</h1>
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>

                )
            })}
        </>
    )
}

export default ProductsPage