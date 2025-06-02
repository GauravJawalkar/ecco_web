"use client"
import Loader from '@/components/Loaders/Loader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Filter, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Key, use, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules"
import "swiper/css";
import { useUserStore } from '@/store/UserStore';
import { discountPercentage } from '@/helpers/discountPercentage';
import { useRouter } from 'next/navigation';
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
    {
        _id: 8,
        category: 'fertilizers',
        name: "Fertilizers"
    },
    {
        _id: 9,
        category: 'accessories',
        name: "Accessories"
    },
]

const ProductsPage = ({ searchParams }: any) => {
    const searchParamsData: searchParams = use(searchParams);
    const category = searchParamsData?.category;
    const [sellerId, setSellerId] = useState("");
    const { data }: any = useUserStore();
    const cartOwnerId = data?._id;
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [discount, setDiscount] = useState(0);
    const [stock, setStock] = useState(0);
    const [vikreta, setVikreta] = useState("");
    const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
    const [sortedProducts, setSortedProducts] = useState<any[]>([]);
    const router = useRouter();
    const [categoryProduct, setCategoryProduct] = useState<any[]>([]);
    const [productId, setProductId] = useState("");

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

    useEffect(() => {
        if (category?.trim() !== "") {
            if (category) {
                mutate(category);
            }
        }
    }, [category, mutate]);

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

    const { data: allProducts = [], isSuccess, isLoading } = useQuery(
        {
            queryFn: getAllProducts,
            queryKey: ['allProducts'],
        }
    );

    useEffect(() => {
        if (isSuccess) {
            setSortedProducts([...new Set(allProducts)]);
        }
    }, [isSuccess]);

    useEffect(() => {
        setCategoryProduct(products);
    }, [products])


    // Add to cart functionality here

    async function addToCart() {
        try {
            const cartOwner = data?._id;
            const sellerName = vikreta;
            const response = await axios.post('../api/addToCart', { cartOwner, name, price, image, sellerName, discount, stock, productId });
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error Adding the product to cart ", error);
            toast.error("Error Adding the product to cart ");
        }
    }

    async function getSellerDetails(id: string) {
        try {
            const response = await axios.get(`../api/getSelletDetails/${id}`);
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.log(`Error getting the user details : `, error)
            return [];
        }
    }

    const { data: sellerDet = [] } = useQuery(
        {
            queryFn: () => getSellerDetails(sellerId),
            queryKey: ['seller', sellerId],
            enabled: !!sellerId,
            refetchOnWindowFocus: false
        }
    )

    const addToCartMutation = useMutation({
        mutationFn: async () => await addToCart(),
        onSuccess: () => {
            toast.success("Item Added To Cart");
            queryClient.invalidateQueries({ queryKey: ['userCart', cartOwnerId] });
        },
    });

    const handelCart = async () => {
        addToCartMutation.mutate();
    }

    const handelAllProductCategory = () => {
        setCategoryProduct([]);
        router.push('/products');
    }

    const handelPriceLowToHigh = () => {
        if (category) {
            setCategoryProduct(() => [...products].sort((a, b) => { return ((a.price - a.discount) - (b.price - b.discount)) }));
        }
        setSortedProducts(() => [...allProducts].sort((a, b) => { return ((a.price - a.discount) - (b.price - b.discount)) }));
    }

    const handelPriceHighToLow = () => {
        if (category) {
            setCategoryProduct(() => [...products].sort((a, b) => { return ((b.price - b.discount) - (a.price - a.discount)) }))
        }
        setSortedProducts(() => [...allProducts].sort((a, b) => { return ((b.price - b.discount) - (a.price - a.discount)) }));
    }
    return (
        <>
            <div className=" py-5 overflow-x-auto ">
                <div className='border dark:border-neutral-700 rounded-full p-3 gap-2 flex w-full items-center justify-start'>
                    <div onClick={handelAllProductCategory} className='px-3 py-2 bg-gray-100 rounded-full capitalize dark:bg-neutral-800 hover:font-semibold hover:-translate-y-1 transition-all ease-linear duration-200 cursor-pointer'>
                        All
                    </div>
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

            {(products && products.length === 0) && <div>No Products Found</div>}
            {isPending && <div><Loader title='Loading...' /></div>}
            {isLoading && <div><Loader title='Loading...' /></div>}

            {/* Filters On the right */}
            <div className='grid grid-cols-[0.5fr_3fr] gap-4'>
                <div className='p-3 border dark:border-neutral-700 rounded-2xl h-fit sticky top-24 flex items-center justify-center flex-col gap-3'>
                    <div className='mt-8 w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl'>
                        <h1 className='pb-2 text-start'>Sort By Price :</h1>
                        <h1 onClick={handelPriceLowToHigh} className='border dark:border-neutral-700 p-1 cursor-pointer text-center text-sm rounded-full mb-2 hover:bg-gray-100 dark:hover:bg-neutral-700'>
                            Low To High
                        </h1>
                        <h1 onClick={handelPriceHighToLow} className='border p-1 dark:border-neutral-700 cursor-pointer text-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700'>
                            High To Low
                        </h1>
                    </div>

                    <div className='w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl'>
                        <h1 className='pb-2 text-start'>Sort By Discount :</h1>
                        <h1
                            onClick={() => {
                                setSortedProducts(() => [...allProducts].sort((a, b) => { return a.discount - b.discount }));
                            }}
                            className='border dark:border-neutral-700 p-1 cursor-pointer text-center text-sm rounded-full mb-2 hover:bg-gray-100 dark:hover:bg-neutral-700'>
                            Low To High
                        </h1>
                        <h1
                            onClick={() => {
                                setSortedProducts(() => [...allProducts].sort((a, b) => { return b.discount - a.discount }))
                            }}
                            className='border p-1 dark:border-neutral-700 cursor-pointer text-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700'>
                            High To Low
                        </h1>
                    </div>

                    <div className='w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl'>
                        <h1 className='pb-2 text-start'>Search By Store :</h1>
                        <input type='search' placeholder='Enter Store Name...' className='border py-1 px-3 cursor-text text-sm rounded-full mb-2 outline-none' />
                    </div>


                    <h1 className='absolute top-0 right-0 px-3 py-1 rounded-tr-2xl rounded-bl-2xl bg-gray-100 flex items-center justify-center gap-1 dark:bg-neutral-800'><Filter className='h-4 w-4' /> Filter Products</h1>
                </div>
                <div className=' grid grid-cols-4 gap-5'>
                    {/* CategoryWise product sorting here */}
                    {
                        categoryProduct?.map(({ _id, name, images, price, seller, stock, discount }: productsProps) => {
                            return (
                                <Link key={_id} onLoad={() => { setSellerId(seller) }} passHref href={`/products/${slugify(name)}?id=${_id}`} className="content-center flex items-center justify-center flex-col cursor-pointer dark:bg-neutral-800 bg-gray-100 rounded-b-3xl rounded-t-2xl w-full">
                                    <div className="w-full py-3 relative">
                                        <Swiper
                                            modules={[EffectFade, Pagination]}
                                            pagination={{ clickable: true }}
                                            navigation={false}
                                            spaceBetween={50}
                                            effect="card">
                                            {images.map(
                                                (elem: string, index: Key | null | undefined) => {
                                                    return (
                                                        <SwiperSlide key={index} className="">
                                                            <Image
                                                                src={elem}
                                                                loading="lazy"
                                                                alt="product-image"
                                                                width={180}
                                                                height={180}
                                                                className="h-64 w-full object-contain rounded" />
                                                        </SwiperSlide>);
                                                })}
                                        </Swiper>
                                        <div className='absolute top-0 right-0 z-10'>
                                            <h1 className='px-3 bg-green-600 rounded-tr-xl rounded-bl-xl text-white'>{Math.round(discountPercentage(price, discount))} % Off</h1>
                                        </div>
                                    </div>
                                    <div dir={"ltr"} className="p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-3xl border">
                                        <div className="text-start text-sm text-gray-500 flex items-center justify-between pb-2">
                                            <h1>Plants</h1>
                                            <h1>⭐ (4.5)</h1>
                                        </div>
                                        <h1 title={name} className="font-semibold capitalize text-start text-lg truncate">
                                            {name}
                                        </h1>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className='flex items-center justify-start gap-3'>
                                                <button type="button" onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setName(name);
                                                    setImage(images?.[0]);
                                                    setPrice(price);
                                                    setStock(stock);
                                                    setDiscount(discount);
                                                    setVikreta(sellerDet?.name);
                                                    setProductId(_id);
                                                    handelCart();
                                                }} className="p-3 border rounded-full text-sm flex items-center justify-center gap-3 dark:border-neutral-700 dark:hover:bg-neutral-800 hover:bg-gray-100">
                                                    <ShoppingCart className="h-5 w-5" />
                                                </button>
                                                <button type="button" onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }} className="p-3 border rounded-full text-sm flex items-center justify-center gap-3 dark:border-neutral-700 dark:hover:bg-neutral-800 hover:bg-gray-100">
                                                    <Heart className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <h1 className="font-semibold text-lg uppercase ">
                                                ₹ {price - discount}
                                            </h1>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }

                    {/* When There is no category all products here */}
                    {!category && sortedProducts?.map(({ _id, name, images, price, seller, stock, discount }: productsProps) => {
                        return (
                            <Link key={_id} onLoad={() => { setSellerId(seller) }} passHref href={`/products/${slugify(name)}?id=${_id}`} className="content-center flex items-center justify-center flex-col cursor-pointer dark:bg-neutral-800 bg-gray-100 rounded-b-3xl rounded-t-2xl w-full">
                                <div className="w-full py-3 relative">
                                    <Swiper
                                        modules={[EffectFade, Pagination]}
                                        pagination={{ clickable: true }}
                                        navigation={false}
                                        spaceBetween={50}
                                        effect="card">
                                        {images.map(
                                            (elem: string, index: Key | null | undefined) => {
                                                return (
                                                    <SwiperSlide key={index} className="">
                                                        <Image
                                                            src={elem}
                                                            loading="lazy"
                                                            alt="product-image"
                                                            width={180}
                                                            height={180}
                                                            className="h-64 w-full object-contain rounded -z-10" />
                                                    </SwiperSlide>);
                                            })}
                                    </Swiper>
                                    <div className='absolute top-0 right-0 z-10'>
                                        <h1 className='px-3 bg-green-600 rounded-tr-xl rounded-bl-xl text-white'>{Math.round(discountPercentage(price, discount))} % Off</h1>
                                    </div>
                                </div>
                                <div dir={"ltr"} className="p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-3xl border">
                                    <div className="text-start text-sm text-gray-500 flex items-center justify-between pb-2">
                                        <h1>Plants</h1>
                                        <h1>⭐ (4.5)</h1>
                                    </div>
                                    <h1 title={name} className="font-semibold capitalize text-start text-lg truncate">
                                        {name}
                                    </h1>
                                    <div className="flex items-center justify-between pt-2">
                                        <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setName(name);
                                            setImage(images?.[0]);
                                            setPrice(price);
                                            setStock(stock);
                                            setDiscount(discount);
                                            setVikreta(sellerDet?.name);
                                            setProductId(_id);
                                            handelCart();
                                        }} className="p-2 border rounded-full text-sm flex items-center justify-center gap-3 dark:border-neutral-700 dark:hover:bg-neutral-800 hover:bg-gray-100">
                                            <ShoppingCart className="h-5 w-5 text-gray-700" />
                                        </button>
                                        <div className='flex items-center justify-center gap-3 text-md'>
                                            <h1 className='line-through text-gray-500' >
                                                ₹ {price}
                                            </h1>
                                            <h1 className="font-semibold text-lg uppercase ">
                                                ₹ {price - discount}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div >
        </>
    )
}

export default ProductsPage