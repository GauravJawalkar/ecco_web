"use client"
import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StoreProductsSkeleton from "../Skeletons/Store/StoreProductsSkeleton";

// Dummy categories
const categories = [
    { label: "All", value: "all" },
    { label: "Indoor Plants", value: "indoor plants" },
    { label: "Outdoor Plants", value: "outdoor plants" },
    { label: "Herbal Plants", value: "herbal plants" },
    { label: "Fertilizers", value: "fertilizers" },
    { label: "Accessories", value: "accessories" },
    { label: "Cactus Plants", value: "cactus plants" },
    { label: "Air Purifying", value: "air purifying" },
    { label: "Fruit Plants", value: "fruit plants" },
];

interface productProps {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discount: number;
    rating: { rateNumber: number }[];
    reviewCount: number;
    category: string;
}

interface StoreProductsShowcaseProps {
    storeProducts: productProps[];
    currentPage: number;
    totalPages: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    loading: boolean
}

const StoreProductsShowcase = ({ storeProducts, currentPage, totalPages, limit, onPageChange, onLimitChange, loading }: StoreProductsShowcaseProps) => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredProducts = useMemo(() => {
        let result = storeProducts || [];
        if (filter !== "all") {
            result = result.filter((p: { category: string }) => p.category === filter);
        }
        if (search.trim()) {
            result = result?.filter((p: { name: string }) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        return result;
    }, [search, filter, storeProducts]);

    const getAverageRating = (rating: { rateNumber: number }[]) => {
        if (rating?.length === 0) return 0;
        const total = rating?.reduce((sum, r) => sum + r.rateNumber, 0);
        return total / rating?.length;
    };

    const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

    return (
        <section className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-0 pb-24 md:pb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Products</h2>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full md:w-auto">
                    <div className="flex items-center bg-white dark:bg-neutral-800 rounded-full border dark:border-neutral-700 px-3 py-2 sm:py-2 focus-within:ring-2 focus-within:ring-green-500 w-full sm:w-auto shadow-sm">
                        <Search className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent outline-none text-sm text-gray-700 dark:text-white w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center w-full sm:w-auto">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 sm:py-2 text-sm rounded-full border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500 cursor-pointer touch-manipulation appearance-none shadow-sm"
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto', paddingRight: '2.5rem' }}
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading && <StoreProductsSkeleton />}

            {/* Product Showcases */}
            {!loading && (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {filteredProducts?.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                        No products found.
                    </div>
                ) : (
                    filteredProducts?.map(({ name, images, _id, price, discount, rating }: productProps) => (
                        <Link href={`/products/${slugify(name)}?id=${_id}`} key={_id} className="bg-white dark:bg-neutral-800 rounded-2xl border dark:border-neutral-700/80 p-3 sm:p-4 flex flex-col touch-manipulation hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md">
                            <Image
                                height={160}
                                width={160}
                                sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 20vw"
                                src={images?.[0]}
                                alt={name}
                                className="w-full h-32 sm:h-40 object-contain rounded-xl mb-2 sm:mb-3 bg-gray-50 dark:bg-neutral-900/70"
                            />
                            <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white line-clamp-2 capitalize" title={name}>
                                {name}
                            </h3>
                            <div className="mt-auto pt-2 sm:pt-3">
                                <div className="flex flex-wrap items-end gap-1.5 sm:gap-2">
                                    <span className="text-green-600 dark:text-green-400 font-bold text-sm sm:text-lg leading-none">₹{(price - discount).toLocaleString()}</span>
                                    {discount > 0 && <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm line-through leading-none">₹{price.toLocaleString()}</span>}
                                </div>
                                <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-yellow-500">
                                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" />
                                    <span className="font-medium text-xs sm:text-sm">{getAverageRating(rating).toFixed(1)}</span>
                                    <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 ml-1">({rating?.length || 0})</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>)}

            {/* Pagination and Limit Controls */}
            {totalPages > 1 && (
                <div className="flex flex-row items-center justify-between mt-8 sm:mt-10 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden md:block">Show per page:</span>
                        <select
                            value={limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="px-3 py-2 text-sm rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500 cursor-pointer touch-manipulation appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto', paddingRight: '2rem' }}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-center bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-full shadow-sm md:p-1">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center p-2 rounded-full text-gray-700 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors touch-manipulation"
                            aria-label="Previous page">
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="px-2 text-sm font-medium text-gray-700 dark:text-white min-w-[100px] text-center">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center p-2 rounded-full text-gray-700 dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors touch-manipulation"
                            aria-label="Next page">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default StoreProductsShowcase;