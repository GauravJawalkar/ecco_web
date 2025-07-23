"use client";
import AddProductModal from "@/components/Modals/AddProductModal";
import CustomCategoryModal from "@/components/Modals/CustomCategoryModal";
import DashBoardStats from "@/components/Dashboard/DashBoardStats";
import MyProducts from "@/components/Dashboard/MyProducts";
import { useUserStore } from "@/store/UserStore";
import Link from "next/link";
import { useState } from "react";
import { LayoutGrid, LayoutList, Lock } from "lucide-react";
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
                <div className={`transition-all duration-300 py-10 ${isStoreLocked === false ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>
                    <div className="flex items-center justify-start gap-3 p-3 border rounded dark:border-neutral-700 dark:text-white">
                        {/* My Products List */}
                        <div>
                            <button
                                className="px-4 py-2 border rounded bg-gray-50 hover:bg-opacity-5 dark:hover:bg-opacity-0 dark:bg-neutral-800 dark:border-neutral-700"
                                onClick={() => { setShowProductModal(true) }}>
                                Add product
                            </button>
                        </div>
                        {/* Custom Category */}
                        <div>
                            <button
                                className="px-4 py-2 border rounded bg-gray-50 hover:bg-opacity-5 dark:hover:bg-opacity-0 dark:bg-neutral-800 dark:border-neutral-700"
                                onClick={() => setShowCustomCategoryModal(true)}>
                                Add Category
                            </button>
                        </div>
                        {/* specialShow button */}
                        {data?.isSuperAdmin && <div>
                            <button className="px-4 py-2 border rounded bg-gray-50 hover:bg-opacity-5 dark:hover:bg-opacity-0 dark:bg-neutral-800 dark:border-neutral-700">
                                <Link href={"/dashboard/specialShow"} >
                                    Special Appearence
                                </Link>
                            </button>
                        </div>}
                        {/* Add A Product */}
                        <div>
                            <button className="px-4 py-2 border rounded bg-gray-50 hover:bg-opacity-5 dark:hover:bg-opacity-0 dark:bg-neutral-800 dark:border-neutral-700">
                                <Link href={'/dashboard/ordersProcess'}>
                                    Process Orders
                                </Link>
                            </button>
                        </div>
                    </div>
                    {(data._id) && (
                        <DashBoardStats
                            sellerId={data._id}
                            isAdmin={data?.isSuperAdmin}
                            load={showProductModal}
                            kycVerified={data?.bankDetails?.status}
                        />
                    )}
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={() => { setListView("grid") }} className="p-2 border rounded dark:border-neutral-700">
                            <LayoutGrid className="w-5 h-5 text-gray-600 dark:text-white" />
                        </button>
                        <button onClick={() => { setListView("list") }} className="p-2 border rounded dark:border-neutral-700">
                            <LayoutList className="w-5 h-5 text-gray-600 dark:text-white" />
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
                        data._id && <MyProducts load={showProductModal} view={listView} sellerId={data?._id} />
                    }
                </div>
                {/* Unlock overlay */}
                {isStoreLocked === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center justify-center p-10 bg-white border shadow-xl dark:bg-neutral-800 dark:border-neutral-700 rounded-xl">
                            <Lock className="w-12 h-12 mb-4 text-red-500" />
                            <h2 className="mb-2 text-2xl font-bold text-gray-800 uppercase dark:text-white">Store Locked</h2>
                            <p className="max-w-sm mb-6 text-center text-gray-600 dark:text-neutral-400 ">Unlock your store to access dashboard features and manage your own products store.</p>
                            <button
                                className="flex items-center gap-2 px-4 py-2 text-sm transition border rounded dark:border-neutral-700 dark:hover:bg-neutral-900/20 hover:bg-gray-100/50"
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
