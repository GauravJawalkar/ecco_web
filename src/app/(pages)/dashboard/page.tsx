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

const Dashboard = () => {
    const { data }: { data: userProps } = useUserStore();
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
    const [listView, setListView] = useState("list");
    const [storeOnboarding, setStoreOnboarding] = useState(false);
    const isStoreLocked = data?.store;

    return (
        <div className="relative min-h-screen">
            <Store />
            <div className={`relative`}>
                {/* Main dashboard content */}
                <div className={`py-10 ${isStoreLocked === false ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>
                    <div className="flex items-center justify-start gap-3 p-4 dark:bg-neutral-850 rounded-lg border border-gray-150 dark:border-neutral-700 shadow-xs">
                        {/* My Products List */}
                        <div>
                            <button
                                className="px-4 py-2.5 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2"
                                onClick={() => { setShowProductModal(true) }}>
                                <PlusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                Add Product
                            </button>
                        </div>

                        {/* Custom Category */}
                        <div>
                            <button
                                className="px-4 py-2.5 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2"
                                onClick={() => setShowCustomCategoryModal(true)}>
                                <FolderPlusIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Add Category
                            </button>
                        </div>

                        {/* specialShow button */}
                        {data?.isSuperAdmin && (
                            <div>
                                <button className="px-4 py-2.5 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                    <Link href={"/dashboard/specialShow"} className="hover:no-underline">
                                        Special Appearance
                                    </Link>
                                </button>
                            </div>
                        )}

                        {/* Process Orders */}
                        <div>
                            <button className="px-4 py-2.5 rounded-md bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2">
                                <TruckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <Link href={'/dashboard/ordersProcess'} className="hover:no-underline">
                                    Process Orders
                                </Link>
                            </button>
                        </div>
                    </div>
                    {(data._id) && (
                        <DashBoardStats
                            sellerId={data._id}
                            isAdmin={data?.isSuperAdmin}
                            kycVerified={data?.bankDetails?.status}
                        />
                    )}
                    <div className="flex items-center justify-end gap-1 rounded-lg bg-gray-100 p-1 dark:bg-neutral-800">
                        <button
                            onClick={() => setListView("grid")}
                            className={`p-2 rounded-md transition-colors ${listView === "grid" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"}`}
                            aria-label="Grid view"
                            title="Grid view"
                        >
                            <LayoutGrid className={`h-5 w-5 transition-colors ${listView === "grid" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-neutral-400"}`} />
                        </button>

                        <button
                            onClick={() => setListView("list")}
                            className={`p-2 rounded-md transition-colors ${listView === "list" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"}`}
                            aria-label="List view"
                            title="List view"
                        >
                            <LayoutList className={`h-5 w-5 transition-colors ${listView === "list" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-neutral-400"}`} />
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
            </div>
        </div >
    );
};

export default Dashboard;