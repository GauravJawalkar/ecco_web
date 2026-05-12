"use client";
import AddProductModal from "@/components/Modals/AddProductModal";
import CustomCategoryModal from "@/components/Modals/CustomCategoryModal";
import DashBoardStats from "@/components/Dashboard/DashBoardStats";
import MyProducts from "@/components/Dashboard/MyProducts";
import { useUserStore } from "@/store/UserStore";
import Link from "next/link";
import { useState } from "react";
import { FolderPlusIcon, LayoutGrid, LayoutList, Lock, PlusIcon, SparklesIcon, TruckIcon } from "lucide-react";
import { userProps } from "@/interfaces/commonInterfaces";
import StoreOnboardingModal from "@/components/Modals/StoreOnboardingModal";
import Store from "@/components/Dashboard/Store";
import ActionsSkeleton from "@/components/Skeletons/Dashboard/ActionsSkeleton";

const Dashboard = () => {
    const { data }: { data: userProps } = useUserStore();
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
    const [listView, setListView] = useState("list");
    const [storeOnboarding, setStoreOnboarding] = useState(false);
    const hasStore = data?.store;
    const bankDetailsStatus = data?.bankDetails?.status;

    return (
        <div className="relative min-h-screen pb-24 md:pb-10">
            <div className={`relative px-4 sm:px-6 lg:px-0 ${!hasStore ? "opacity-30 pointer-events-none select-none blur-[2px] transition-all duration-500" : "opacity-100 transition-all duration-500"}`}>
                <Store />
                {/* Main dashboard content */}
                <div className={`py-6 md:py-10`}>
                    {(data._id) && (
                        <DashBoardStats
                            sellerId={data._id}
                            isAdmin={data?.isSuperAdmin}
                            kycVerified={data?.bankDetails?.status} />
                    )}
                    {data?.storeDetails?.storeName?.trim()?.length > 0 ? (
                        <div className="my-4 flex overflow-x-auto no-scrollbar items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-xl shadow-xs dark:bg-neutral-850 border-gray-150 dark:border-neutral-700 relative z-10 sm:flex-wrap">
                            <button
                                className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none"
                                onClick={() => setShowProductModal(true)}>
                                <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                Add Product
                            </button>

                            <button
                                className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none"
                                onClick={() => setShowCustomCategoryModal(true)}>
                                <FolderPlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                Add Category
                            </button>

                            {data?.isSuperAdmin && (
                                <Link href="/dashboard/specialShow" className="contents">
                                    <button className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none">
                                        <SparklesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                                        Special Show
                                    </button>
                                </Link>
                            )}

                            <Link href="/dashboard/ordersProcess" className="contents">
                                <button className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none">
                                    <TruckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    Orders
                                </button>
                            </Link>
                        </div>
                    ) : <ActionsSkeleton data={data} />}
                    {/* List and Grid View */}
                    <div className="flex items-center justify-end gap-2 p-1 bg-gray-100 rounded-lg dark:bg-neutral-800 overflow-x-auto w-full sm:w-fit sm:ml-auto">
                        <button
                            onClick={() => setListView("grid")}
                            className={`flex-1 sm:flex-none p-2 rounded-md transition-colors ${listView === "grid" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"} flex items-center justify-center gap-2 text-[13px] capitalize touch-manipulation`}
                            aria-label="Grid view"
                            title="Grid view">
                            <LayoutGrid className={`h-4 w-4 transition-colors flex-shrink-0 ${listView === "grid" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-neutral-400"}`} />Grid View
                        </button>

                        <button
                            onClick={() => setListView("list")}
                            className={`flex-1 sm:flex-none p-2 rounded-md transition-colors ${listView === "list" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"} flex items-center justify-center gap-2 text-[13px] capitalize touch-manipulation`}
                            aria-label="List view"
                            title="List view">
                            <LayoutList className={`h-4 w-4 transition-colors flex-shrink-0 ${listView === "list" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-neutral-400"}`} />List View
                        </button>
                    </div>
                    {data._id && <AddProductModal
                        isVisible={showProductModal}
                        onClose={() => {
                            setShowProductModal(false);
                        }}
                    />}
                    {data._id && <CustomCategoryModal
                        isVisible={showCustomCategoryModal}
                        onClose={() => setShowCustomCategoryModal(false)}
                        creator={data?._id} />}
                    {
                        data._id && <MyProducts view={listView} sellerId={data?._id} />
                    }
                </div>
            </div>

            {/* Unlock Store overlay */}
            {!hasStore && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 min-h-[500px]">
                    {/* Glassmorphic backdrop */}
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[2px] rounded-2xl" />

                    {/* Premium Floating Card */}
                    <div className="relative z-50 flex flex-col items-center justify-center p-8 sm:p-10 w-full max-w-[420px] bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800 shadow-2xl rounded-3xl animate-in zoom-in-95 duration-300">

                        {/* Glowing Lock Icon */}
                        <div className="relative flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 group">
                            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl group-hover:bg-red-500/30 transition-colors" />
                            <Lock className="relative z-10 w-8 h-8 text-red-600 dark:text-red-500" />
                        </div>

                        <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Store is Locked</h2>
                        <p className="mb-8 text-sm text-center text-gray-500 dark:text-neutral-400 leading-relaxed px-4">
                            You need to onboard your store before you can access the dashboard features and manage products.
                        </p>

                        <button
                            className="flex items-center justify-center w-full gap-2 h-12 px-6 text-sm font-medium text-white transition-all bg-green-700 dark:bg-white dark:text-gray-900 rounded-xl hover:bg-green-800 dark:hover:bg-gray-200 active:scale-[0.98] shadow-sm"
                            onClick={() => setStoreOnboarding(true)}
                        >
                            <Lock className="w-4 h-4" />
                            Unlock Store Now
                        </button>
                    </div>
                </div>
            )}

            <StoreOnboardingModal isOpen={storeOnboarding} onClose={() => setStoreOnboarding(false)} ownerId={data._id} />
        </div >
    );
};

export default Dashboard;