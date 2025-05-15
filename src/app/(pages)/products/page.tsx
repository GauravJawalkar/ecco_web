"use client"
import Loader from '@/components/Loaders/Loader';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
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

export const AllFilters = [
    {
        _id: 1,
        category: 'indoor plants',
        name: "Indoors"
    },
    {
        _id: 2,
        category: 'outdoor plants',
        name: "Outdoors"
    },
    {
        _id: 3,
        category: 'herbal plants',
        name: "Herbal"
    },
    {
        _id: 4,
        category: 'cactus plants',
        name: "Cactus"
    },
    {
        _id: 5,
        category: 'fruit plants',
        name: "fruits"
    },
    {
        _id: 6,
        category: 'air purifying',
        name: "Air Purify"
    },
    {
        _id: 7,
        category: 'climber plants',
        name: "Climber"
    },
]

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
            <div className=''>
                <div className="w-full flex items-center justify-start gap-3 py-5 overflow-x-auto">
                    <Link href={`/products`} className='px-3 py-2 bg-gray-100 rounded-full capitalize dark:bg-neutral-800 hover:font-semibold hover:-translate-y-1 transition-all ease-linear duration-200'>
                        All
                    </Link>
                    {
                        AllFilters.map(({ _id, name, category }) => {
                            return (
                                <Link key={_id} href={`/products?category=${category}`} className='px-3 py-2 bg-gray-100 rounded-full capitalize dark:bg-neutral-800 hover:font-semibold hover:-translate-y-1 transition-all ease-linear duration-200'>
                                    {name}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            {/* CategoryWise Sorting queries here */}
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





            {/* When There is no category all products here */}
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