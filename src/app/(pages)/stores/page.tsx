"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Filter } from "lucide-react";
import StoreCard from "@/components/Stores/StoreCard";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loaders/Loader";
import MainStoreSkeleton from "@/components/Skeletons/Store/MainStoreSkeleton";
import ApiClient from "@/interceptors/ApiClient";

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
            const response = await ApiClient.get(`/api/getStores?page=${page}`);
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
        <div className="min-h-screen px-4 py-10 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <div className="mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="mb-8 text-3xl font-extrabold text-center text-gray-900 md:text-4xl dark:text-white">
                        Explore All Stores
                    </h1>
                    <div className="flex flex-col items-center justify-start gap-4 mb-8 md:flex-row">
                        <div className="flex items-center w-full px-4 py-2 bg-white border rounded-lg md:w-2/3 dark:bg-neutral-800 dark:border-neutral-700">
                            <Search className="w-5 h-5 mr-2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search stores by name, description, or ID..."
                                className="w-full text-gray-700 bg-transparent outline-none dark:text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-3 py-2 text-gray-700 bg-white border rounded-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            >
                                {filterOptions?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {
                    (filteredStores?.length === 0 && isError) && <div>Error Loading The Stores</div>
                }
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {isLoading ? (
                        [...Array(4)].map((_, index) => (
                            <MainStoreSkeleton key={index} />
                        ))
                    ) : (
                        filteredStores?.length === 0 ? (
                            <div>No Stores Found</div>
                        ) : (
                            filteredStores?.map((store: StoreProps) => (
                                <StoreCard key={store?._id} store={store} />
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default page;