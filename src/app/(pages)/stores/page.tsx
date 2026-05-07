"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StoreCard from "@/components/Stores/StoreCard";
import { useQuery } from "@tanstack/react-query";
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
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 pb-24 md:pb-10">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white ">
                        Explore All Stores
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-start gap-3 sm:gap-4 w-full md:w-auto flex-1 md:max-w-xl lg:max-w-2xl">
                        <div className="flex items-center w-full px-4 py-2 sm:py-2 bg-white border rounded-full dark:bg-neutral-800 dark:border-neutral-700 shadow-sm focus-within:ring-2 focus-within:ring-green-500 ">
                            <Search className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search stores..."
                                className="w-full text-sm sm:text-base text-gray-700 bg-transparent outline-none dark:text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center w-full sm:w-auto">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 sm:py-2 text-sm sm:text-base text-gray-700 bg-white border rounded-full dark:border-neutral-700 dark:bg-neutral-800 dark:text-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none cursor-pointer touch-manipulation appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto', paddingRight: '2.5rem' }}
                            >
                                {filterOptions?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {
                    (filteredStores?.length === 0 && isError) && <div className="text-center py-10 text-gray-500 dark:text-gray-400">Error Loading The Stores</div>
                }
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {isLoading ? (
                        [...Array(8)].map((_, index) => (
                            <MainStoreSkeleton key={index} />
                        ))
                    ) : (
                        filteredStores?.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">No Stores Found</div>
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