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
        <div className="relative min-h-screen">
            <div className={`relative ${isStoreLocked === false ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>
                <Store />
                {/* Main dashboard content */}
                <div className={`py-10 `}>
                    {data?.storeDetails?.storeName.trim()?.length > 0 ? <div className="flex items-center justify-start gap-3 p-4 border rounded-lg shadow-xs dark:bg-neutral-850 border-gray-150 dark:border-neutral-700">
                        {/* My Products List */}
                        <div>
                            <button
                                className="px-4 py-2.5 rounded-md bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2 hover:bg-gradient-to-tl"
                                onClick={() => { setShowProductModal(true) }}>
                                <PlusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                Add Product
                            </button>
                        </div>

                        {/* Custom Category */}
                        <div>
                            <button
                                className="px-4 py-2.5 rounded-md bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-800 border dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2 hover:bg-gradient-to-tl"
                                onClick={() => setShowCustomCategoryModal(true)}>
                                <FolderPlusIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Add Category
                            </button>
                        </div>

                        {/* specialShow button */}
                        {data?.isSuperAdmin && (
                            <div>
                                <Link href={"/dashboard/specialShow"} className="hover:no-underline">
                                    <button className="px-4 py-2.5 rounded-md bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2 hover:bg-gradient-to-tl">
                                        <SparklesIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                        Special Appearance
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Process Orders */}
                        <div>
                            <Link href={'/dashboard/ordersProcess'} className="hover:no-underline">
                                <button className="px-4 py-2.5 rounded-md bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 font-medium hover:bg-gray-50 dark:hover:bg-neutral-750 duration-200 flex items-center gap-2 hover:bg-gradient-to-tl">
                                    <TruckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    Process Orders
                                </button>
                            </Link>
                        </div>
                    </div> : <ActionsSkeleton data={data} />}
                    {(data._id) && (
                        <DashBoardStats
                            sellerId={data._id}
                            isAdmin={data?.isSuperAdmin}
                            kycVerified={data?.bankDetails?.status} />
                    )}
                    {/* List and Grid View */}
                    <div className="flex items-center justify-end gap-2 p-1 bg-gray-100 rounded-lg dark:bg-neutral-800">
                        <button
                            onClick={() => setListView("grid")}
                            className={`p-2 rounded-md transition-colors ${listView === "grid" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"} flex items-center justify-center gap-2 text-sm capitalize`}
                            aria-label="Grid view"
                            title="Grid view">
                            <LayoutGrid className={`h-5 w-5 transition-colors ${listView === "grid" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-neutral-400"}`} />Grid View
                        </button>

                        <button
                            onClick={() => setListView("list")}
                            className={`p-2 rounded-md transition-colors ${listView === "list" ? "bg-white shadow-sm dark:bg-neutral-700" : "hover:bg-gray-200 dark:hover:bg-neutral-700/50"} flex items-center justify-center gap-2 text-sm capitalize`}
                            aria-label="List view"
                            title="List view">
                            <LayoutList className={`h-5 w-5 transition-colors ${listView === "list" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-neutral-400"}`} />List View
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