"use client"
import React, { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";

// Dummy data for products
const dummyProducts = [
    {
        id: "P-001",
        name: "Eco Cotton T-Shirt",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
        price: 799,
        rating: 4.5,
        reviewCount: 32,
        category: "Clothing",
    },
    {
        id: "P-002",
        name: "Bamboo Toothbrush",
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
        price: 199,
        rating: 4.8,
        reviewCount: 18,
        category: "Accessories",
    },
    {
        id: "P-003",
        name: "Reusable Water Bottle",
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        price: 499,
        rating: 4.2,
        reviewCount: 25,
        category: "Accessories",
    },
    {
        id: "P-004",
        name: "Organic Cotton Tote Bag",
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
        price: 349,
        rating: 4.7,
        reviewCount: 40,
        category: "Bags",
    },
];

// Dummy categories
const categories = [
    { label: "All", value: "all" },
    { label: "Clothing", value: "Clothing" },
    { label: "Accessories", value: "Accessories" },
    { label: "Bags", value: "Bags" },
];

const StoreProductsShowcase = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const filteredProducts = useMemo(() => {
        let result = dummyProducts;
        if (filter !== "all") {
            result = result.filter((p) => p.category === filter);
        }
        if (search.trim()) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        return result;
    }, [search, filter]);

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
                            className="px-3 py-2 rounded-lg border dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-10">
                        No products found.
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow border dark:border-neutral-700 p-4 flex flex-col">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-green-600 dark:text-green-400 font-bold text-base">₹{product.price}</span>
                                <span className="flex items-center gap-1 ml-auto text-yellow-500">
                                    <Star className="w-4 h-4" fill="currentColor" />
                                    <span className="font-medium">{product.rating}</span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">({product.reviewCount})</span>
                                </span>
                            </div>
                            {/* Reviews preview */}
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {product.reviewCount} reviews
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default StoreProductsShowcase;