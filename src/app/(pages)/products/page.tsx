"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Filter, ShoppingCart, X } from 'lucide-react';
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
import { userProps } from '@/interfaces/commonInterfaces';
import MainProductsPageSkeleton from '@/components/Skeletons/Products/MainProductsPageSkeleton';
import ApiClient from '@/interceptors/ApiClient';

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
    rating: [],
    seller: string
}

export const AllFilters = [
    { _id: 1, category: 'indoor plants', name: "Indoors" },
    { _id: 2, category: 'outdoor plants', name: "Outdoors" },
    { _id: 3, category: 'herbal plants', name: "Herbal" },
    { _id: 4, category: 'cactus plants', name: "Cactus" },
    { _id: 5, category: 'fruit plants', name: "Fruits" },
    { _id: 6, category: 'air purifying', name: "Air Purify" },
    { _id: 7, category: 'climber plants', name: "Climber" },
    { _id: 8, category: 'fertilizers', name: "Fertilizers" },
    { _id: 9, category: 'accessories', name: "Accessories" },
]

const ProductsPage = ({ searchParams }: any) => {
    const searchParamsData: searchParams = use(searchParams);
    const category = searchParamsData?.category;
    const [sellerId, setSellerId] = useState("");
    const { data }: { data: userProps } = useUserStore();
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
    const [page, setPage] = useState(1);
    const [categoryPage, setCategoryPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryTotalPages, setCategoryTotalPages] = useState(1);

    // Mobile filter drawer state
    const [filterOpen, setFilterOpen] = useState(false);

    async function getFilteredData(category: string) {
        try {
            const response = await ApiClient.post('/api/filteredProducts', { category, categoryPage });
            if (response.data.data) {
                setCategoryTotalPages(response.data?.totalCategoryPages || 1);
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
            if (category) mutate(category);
        }
    }, [category, mutate]);

    async function getAllProducts() {
        try {
            const response = await ApiClient.get(`/api/getAllProducts?page=${page}`);
            if (response.data?.data) {
                setTotalPages(response.data?.totalPages || 1);
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error getting all the products ", error)
            return [];
        }
    }

    const { data: allProducts = [], isSuccess, isLoading } = useQuery({
        queryFn: getAllProducts,
        queryKey: ['allProducts', page],
    });

    useEffect(() => {
        if (isSuccess) setSortedProducts(allProducts || []);
    }, [isSuccess, page]);

    useEffect(() => {
        setCategoryProduct(products || []);
    }, [products, categoryPage]);

    async function addToCart() {
        try {
            const cartOwner = data?._id;
            const sellerName = vikreta;
            const response = await ApiClient.post('/api/addToCart', { cartOwner, name, price, image, sellerName, discount, stock, productId, sellerId });
            if (response.data.data) return response.data.data;
            return [];
        } catch (error) {
            console.error("Error Adding the product to cart ", error);
            toast.error("Error Adding the product to cart");
        }
    }

    async function getSellerDetails(id: string) {
        try {
            const response = await ApiClient.get(`/api/getSelletDetails/${id}`);
            if (response.data.data) return response.data.data;
            return [];
        } catch (error) {
            console.error(`Error getting the user details : `, error)
            return [];
        }
    }

    const { data: sellerDet = [] } = useQuery({
        queryFn: () => getSellerDetails(sellerId),
        queryKey: ['seller', sellerId],
        enabled: !!sellerId,
        refetchOnWindowFocus: false
    });

    const addToCartMutation = useMutation({
        mutationFn: async () => await addToCart(),
        onSuccess: () => {
            toast.success("Item Added To Cart");
            queryClient.invalidateQueries({ queryKey: ['userCart', cartOwnerId] });
        },
    });

    const handelCart = async () => addToCartMutation.mutate();

    const handelAllProductCategory = () => {
        setCategoryProduct([]);
        router.push('/products');
    }

    const handelPriceLowToHigh = () => {
        if (category) setCategoryProduct(() => [...products].sort((a, b) => (a.price - a.discount) - (b.price - b.discount)));
        setSortedProducts(() => [...allProducts].sort((a, b) => (a.price - a.discount) - (b.price - b.discount)));
    }

    const handelPriceHighToLow = () => {
        if (category) setCategoryProduct(() => [...products].sort((a, b) => (b.price - b.discount) - (a.price - a.discount)));
        setSortedProducts(() => [...allProducts].sort((a, b) => (b.price - b.discount) - (a.price - a.discount)));
    }

    const handelDiscountLowToHigh = () => {
        const getPct = (p: any) => ((p.discount || 0) / (p.price + (p.discount || 0))) * 100;
        if (category) setCategoryProduct(() => [...products].sort((a, b) => getPct(a) - getPct(b)));
        setSortedProducts(() => [...allProducts].sort((a, b) => getPct(a) - getPct(b)));
    }

    const handelDiscountHighToLow = () => {
        const getPct = (p: any) => ((p.discount || 0) / (p.price + (p.discount || 0))) * 100;
        if (category) setCategoryProduct(() => [...products].sort((a, b) => getPct(b) - getPct(a)));
        setSortedProducts(() => [...allProducts].sort((a, b) => getPct(b) - getPct(a)));
    }

    const getAverageRating = (rating: { rateNumber: number }[]) => {
        if (rating?.length === 0) return 0;
        const total = rating?.reduce((sum, r) => sum + r.rateNumber, 0);
        return total / rating?.length;
    };

    /* ── Shared product card ── */
    const ProductCard = ({ _id, name, images, price, seller, stock, discount, rating }: productsProps) => (
        <Link
            key={_id}
            onLoad={() => setSellerId(seller)}
            passHref
            href={`/products/${slugify(name)}?id=${_id}`}
            className="content-center flex items-center justify-center flex-col cursor-pointer dark:bg-neutral-800 bg-gray-100 rounded-b-3xl rounded-t-2xl w-full active:scale-[0.97] transition-transform duration-150 touch-manipulation">
            <div className="w-full py-3 sm:py-4 relative">
                <Swiper
                    modules={[EffectFade, Pagination]}
                    pagination={{
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !mx-1 !bg-gray-300 dark:!bg-neutral-600',
                        bulletActiveClass: '!bg-gray-800 dark:!bg-white'
                    }}
                    spaceBetween={50}
                    effect="card">
                    {images.map((elem: string, index: Key | null | undefined) => (
                        <SwiperSlide key={index}>
                            <Image
                                src={elem}
                                loading="lazy"
                                alt="product-image"
                                width={180}
                                height={180}
                                className="h-36 sm:h-48 lg:h-64 w-full object-contain rounded -z-10"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <span className="absolute z-10 top-2 left-2 px-2 py-1 rounded-full text-[9px] font-medium leading-none tracking-wide bg-green-600 dark:bg-green-600 text-white dark:text-white lg:top-0 lg:right-0 lg:left-auto lg:rounded-tr-xl lg:rounded-bl-xl lg:rounded-tl-none lg:rounded-br-none lg:rounded-none lg:bg-green-600 lg:dark:bg-green-600 lg:text-white lg:dark:text-white lg:px-3 lg:py-0 lg:text-sm lg:font-normal lg:tracking-normal lg:leading-normal">
                    {Math.round(discountPercentage(price, discount))}% Off
                </span>
            </div>
            <div dir="ltr" className="p-2.5 sm:p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-b-xl md:rounded-3xl border">
                <div className="text-start text-[10px] sm:text-sm text-gray-500 flex items-center justify-between pb-1.5 sm:pb-2">
                    <span>Plants</span>
                    <span>⭐ ({getAverageRating(rating)})</span>
                </div>
                <h1 title={name} className="text-start line-clamp-2 capitalize font-medium sm:font-semibold text-xs sm:text-sm lg:text-lg my-1 lg:my-1.5 min-h-[2rem] lg:min-h-[3.5rem]">
                    {name}
                </h1>
                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setName(name); setImage(images?.[0]); setPrice(price);
                            setStock(stock); setDiscount(discount);
                            setVikreta(sellerDet?.name); setProductId(_id);
                            handelCart();
                        }}
                        className="p-1.5 sm:p-2 border rounded-full flex items-center justify-center dark:border-neutral-700 dark:hover:bg-neutral-800 hover:bg-gray-100"
                    >
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <div className="flex items-center justify-center text-center gap-1.5 sm:gap-3">
                        <span className="line-through text-gray-400 text-xs sm:text-sm">₹{price}</span>
                        <span className="font-semibold text-sm sm:text-base lg:text-lg uppercase">₹{price - discount}</span>
                    </div>
                </div>
            </div>
        </Link>
    );

    /* ── Filter panel content — shared between sidebar and drawer ── */
    const FilterContent = () => (
        <div className="flex flex-col gap-3 w-full">
            <div className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl">
                <p className="pb-2 text-sm font-medium">Sort By Price</p>
                <button onClick={handelPriceLowToHigh} className="w-full border dark:border-neutral-700 p-1.5 cursor-pointer text-center text-sm rounded-full mb-2 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                    Low to High
                </button>
                <button onClick={handelPriceHighToLow} className="w-full border dark:border-neutral-700 p-1.5 cursor-pointer text-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                    High to Low
                </button>
            </div>
            <div className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl">
                <p className="pb-2 text-sm font-medium">Sort By Discount</p>
                <button onClick={handelDiscountLowToHigh} className="w-full border dark:border-neutral-700 p-1.5 cursor-pointer text-center text-sm rounded-full mb-2 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                    Low to High
                </button>
                <button onClick={handelDiscountHighToLow} className="w-full border dark:border-neutral-700 p-1.5 cursor-pointer text-center text-sm rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors">
                    High to Low
                </button>
            </div>
            <div className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl">
                <p className="pb-2 text-sm font-medium">Search By Store</p>
                <input
                    type="search"
                    placeholder="Enter store name..."
                    className="w-full border dark:border-neutral-700 py-1.5 px-3 text-sm rounded-full outline-none bg-transparent"
                />
            </div>
        </div>
    );

    return (
        <>
            {/* ── Category filter bar ── */}
            <div className="px-3 lg:px-0 py-4 w-full">
                <div className="border dark:border-neutral-700 rounded-full px-1 sm:px-2 py-0.5 flex items-center w-full">
                    <div className="flex gap-2 items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full px-1.5 sm:px-1 py-2">
                        <button
                            onClick={handelAllProductCategory}
                            className="px-4 py-1.5 bg-gray-100 rounded-full capitalize dark:bg-neutral-800 hover:font-semibold hover:-translate-y-1 transition-all ease-linear duration-200 text-sm whitespace-nowrap flex-shrink-0"
                        >
                            All
                        </button>
                        {AllFilters.map(({ _id, name, category }) => (
                            <Link
                                key={_id}
                                href={`/products?category=${category}`}
                                className="px-4 py-1.5 bg-gray-100 rounded-full capitalize dark:bg-neutral-800 hover:font-semibold hover:-translate-y-1 transition-all ease-linear duration-200 text-sm whitespace-nowrap flex-shrink-0"
                            >
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Mobile filter button ── */}
            <div className="flex lg:hidden justify-end mb-3 mx-2">
                <button
                    onClick={() => setFilterOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border dark:border-neutral-700 rounded-full text-sm bg-gray-50 dark:bg-neutral-800"
                >
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                </button>
            </div>

            {/* ── Mobile filter drawer ── */}
            {filterOpen && (
                <div className="fixed inset-0 z-[60] flex lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setFilterOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-2xl p-5 pb-8 z-10 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filter Products
                            </h2>
                            <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <FilterContent />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_3fr] gap-4">

                {/* ── Desktop sidebar filter ── */}
                <div className="hidden lg:flex p-3 border dark:border-neutral-700 rounded-2xl h-fit sticky top-24 items-center justify-center flex-col gap-3 relative">
                    <div className="mt-8 w-full">
                        <FilterContent />
                    </div>
                    <span className="absolute top-0 right-0 px-3 py-1 rounded-tr-2xl rounded-bl-2xl bg-gray-100 flex items-center justify-center gap-1 dark:bg-neutral-800 text-sm">
                        <Filter className="h-4 w-4" /> Filter Products
                    </span>
                </div>

                {/* ── Product grid ── */}
                <div>
                    {products && products.length === 0 && (
                        <div className="flex items-center justify-center py-10">
                            <p className="text-sm text-gray-400">No Products Found</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 pb-5 px-3 lg:px-0">
                        {!category && isLoading && <MainProductsPageSkeleton />}
                        {isPending && <MainProductsPageSkeleton />}

                        {categoryProduct?.map((product: productsProps) => (
                            <ProductCard key={product._id} {...product} />
                        ))}

                        {!category && sortedProducts?.map((product: productsProps) => (
                            <ProductCard key={product._id} {...product} />
                        ))}
                    </div>

                    {/* All products pagination */}
                    {!category && totalPages > 1 && (
                        <div className={`justify-center items-center gap-4 my-4 ${isLoading ? "hidden" : "flex"}`}>
                            <button
                                className="border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-sm">Page <strong>{page}</strong> of {totalPages}</span>
                            <button
                                className="border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {/* Category pagination */}
                    {category && categoryTotalPages > 1 && (
                        <div className={`justify-center items-center gap-4 my-4 ${isPending ? "hidden" : "flex"}`}>
                            <button
                                className="border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
                                disabled={categoryPage === 1}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-sm">Page <strong>{categoryPage}</strong> of {categoryTotalPages}</span>
                            <button
                                className="border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCategoryPage((prev) => Math.min(prev + 1, categoryTotalPages))}
                                disabled={categoryPage === categoryTotalPages}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProductsPage;