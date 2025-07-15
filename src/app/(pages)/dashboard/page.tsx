"use client";
import AddProductModal from "@/components/Modals/AddProductModal";
import CustomCategoryModal from "@/components/Modals/CustomCategoryModal";
import DashBoardStats from "@/components/Dashboard/DashBoardStats";
import MyProducts from "@/components/Dashboard/MyProducts";
import { useUserStore } from "@/store/UserStore";
import Link from "next/link";
import { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { userProps } from "@/interfaces/commonInterfaces";

const Dashboard = () => {
    const { data }: { data: userProps } = useUserStore();
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
    const [listView, setListView] = useState("list");

    return (
        <div className="min-h-screen">

            <h1 className="p-5 my-5 text-2xl font-semibold text-center capitalize rounded w-fit bg-gradient-to-r from-red-100 via-fuchsia-100 to-yellow-100 dark:text-black">🏪 {data?.name}'<span className="lowercase">s</span> Store</h1>

            <div className={`relative`}>
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
                {/* TODO: recall the api whenever a call is triggered for toggling a product modal */}
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
        </div >
    );
};

export default Dashboard;
