"use client"
import React, { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

const StoreProductsShowcase = ({ storeProducts }: any) => {
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
        <section className="py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                    <div className="flex items-center bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-700 px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent outline-none text-gray-700 dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-white outline-none"
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                {filteredProducts?.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-10">
                        No products found.
                    </div>
                ) : (
                    filteredProducts?.map(({ name, images, _id, price, discount, rating }: productProps) => (
                        <Link href={`/products/${slugify(name)}?id=${_id}`} key={_id} className="bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-700/80 p-4 flex flex-col">
                            <Image
                                height={160}
                                width={160}
                                src={images?.[0]}
                                alt={name}
                                className="w-full h-40 object-contain rounded-md mb-3 bg-gray-100 dark:bg-neutral-900/70 transition-transform duration-300"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate capitalize" title={name}>
                                {name}
                            </h3>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <span className="text-green-600 dark:text-green-400 font-bold text-lg">₹ {price - discount}</span>
                                <span className="text-gray-700 decoration-gray-700 text-sm line-through">₹{price}</span>
                                <span className="flex items-center gap-1 ml-auto text-yellow-500">
                                    <Star className="w-4 h-4" fill="currentColor" />
                                    <span className="font-medium">{getAverageRating(rating)}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">( {rating?.length} )</span>
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
};

export default StoreProductsShowcase;