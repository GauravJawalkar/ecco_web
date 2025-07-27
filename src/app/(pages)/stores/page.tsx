"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Filter } from "lucide-react";
import StoreCard from "@/components/Stores/StoreCard";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loaders/Loader";

interface StoreProps {
    _id: string;
    storeName: string;
    storeImage?: string;
    storeCoverImage?: string;
    rating?: number;
    reviewCount?: number;
    category?: string;
    location?: string;
}

const page = () => {

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);

    async function fetchStores() {
        try {
            const response = await axios.get(`/api/getStores?page=${page}`);
            if (response?.data?.data) {
                return response.data?.data;
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
        }
    }

    const { data: stores = [], isLoading, isError } = useQuery({
        queryKey: ["stores"],
        queryFn: fetchStores,
        refetchOnWindowFocus: false,
    });

    const filteredStores = useMemo(() => {
        let result = stores;
        if (search.trim()) {
            result = result.filter(
                (store: StoreProps) =>
                    store.storeName.toLowerCase().includes(search.toLowerCase())
            );
        }
        return result;
    }, [search, filter, stores]);


    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Fashion", value: "fashion" },
        { label: "Electronics", value: "electronics" },
        { label: "Home", value: "home" },
    ];

    return (
        <div className="min-h-screen dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 py-10 px-4">
            <div className="mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
                        Explore All Stores
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-start  gap-4 mb-8">
                        <div className="flex items-center w-full md:w-2/3 bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-700 px-4 py-2">
                            <Search className="w-5 h-5 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search stores by name, description, or ID..."
                                className="w-full bg-transparent outline-none text-gray-700 dark:text-white"
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
                                {filterOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {
                    (filteredStores.length === 0 && isLoading) && <Loader title="Loading stores..." />
                }
                {
                    (filteredStores.length === 0 && isError) && <div>Error Loading The Stores</div>
                }
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(filteredStores?.length === 0 && !isLoading && !isError) ? (
                        <div>No Stores Found</div>
                    ) : (
                        filteredStores.map((store: StoreProps) => (
                            <StoreCard key={store?._id} store={store} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default page;