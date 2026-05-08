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
    const isStoreLocked = data?.store;
    const bankDetailsStatus = data?.bankDetails?.status;

    return (
        <div className="relative min-h-screen pb-24 md:pb-10">
            <div className={`relative px-4 sm:px-6 lg:px-0 ${isStoreLocked === false ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>
                <Store />
                {/* Main dashboard content */}
                <div className={`py-6 md:py-10`}>
                    {(data._id) && (
                        <DashBoardStats
                            sellerId={data._id}
                            isAdmin={data?.isSuperAdmin}
                            kycVerified={data?.bankDetails?.status} />
                    )}
                    {data?.storeDetails?.storeName.trim()?.length > 0 ? (
                        <div className="my-4 flex overflow-x-auto no-scrollbar items-center gap-2 sm:gap-3 p-3 sm:p-4 border rounded-xl shadow-xs dark:bg-neutral-850 border-gray-150 dark:border-neutral-700 relative z-10 sm:flex-wrap">
                            <button
                                className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none"
                                onClick={() => setShowProductModal(true)}>
                                <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                Add Product
                            </button>

                            <button
                                className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none"
                                onClick={() => setShowCustomCategoryModal(true)}>
                                <FolderPlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                Add Category
                            </button>

                            {data?.isSuperAdmin && (
                                <Link href="/dashboard/specialShow" className="contents">
                                    <button className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none">
                                        <SparklesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                                        Special Show
                                    </button>
                                </Link>
                            )}

                            <Link href="/dashboard/ordersProcess" className="contents">
                                <button className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3 sm:py-2.5 rounded-full sm:rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-750 transition-colors text-xs sm:text-sm font-medium text-gray-700 dark:text-neutral-200 shadow-sm sm:shadow-none">
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
                            className={`flex-1 sm:flex-none p-2 rounded-md transition-colors ${listView === "grid" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"} flex items-center justify-center gap-2 text-sm capitalize touch-manipulation`}
                            aria-label="Grid view"
                            title="Grid view">
                            <LayoutGrid className={`h-5 w-5 transition-colors flex-shrink-0 ${listView === "grid" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-neutral-400"}`} />Grid View
                        </button>

                        <button
                            onClick={() => setListView("list")}
                            className={`flex-1 sm:flex-none p-2 rounded-md transition-colors ${listView === "list" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"} flex items-center justify-center gap-2 text-sm capitalize touch-manipulation`}
                            aria-label="List view"
                            title="List view">
                            <LayoutList className={`h-5 w-5 transition-colors flex-shrink-0 ${listView === "list" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-neutral-400"}`} />List View
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
            {isStoreLocked === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center p-10 bg-white border shadow-xl dark:bg-neutral-800 dark:border-neutral-700 rounded-xl">
                        <Lock className="w-12 h-12 mb-4 text-red-500" />
                        <h2 className="mb-2 text-2xl font-bold text-gray-800 uppercase dark:text-white">Store Locked</h2>
                        <p className="max-w-sm mb-6 text-center text-gray-600 dark:text-neutral-400 ">Unlock your store to access dashboard features and manage your own products store.</p>
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded dark:border-neutral-700 dark:hover:bg-neutral-900/20 hover:bg-gray-100/50"
                            onClick={() => { setStoreOnboarding(true) }}>
                            <Lock className="w-5 h-5 opacity-70" />
                            Unlock Store
                        </button>
                    </div>
                </div>
            )}
            <StoreOnboardingModal isOpen={storeOnboarding} onClose={() => setStoreOnboarding(false)} ownerId={data._id} />
        </div >
    );
};

export default Dashboard;