"use client";
import AddProductModal from "@/components/Modals/AddProductModal";
import CustomCategoryModal from "@/components/Modals/CustomCategoryModal";
import DashBoardStats from "@/components/Dashboard/DashBoardStats";
import MyProducts from "@/components/Dashboard/MyProducts";
import { useUserStore } from "@/store/UserStore";
import Link from "next/link";
import { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";

const Dashboard = () => {
    const { data }: any = useUserStore();
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
    const [listView, setListView] = useState("list");

    return (
        <div className="min-h-screen">

            <h1 className="capitalize p-5 my-5 rounded  text-center text-2xl w-fit font-semibold   bg-gradient-to-r from-red-100 via-fuchsia-100 to-yellow-100 dark:text-black">🏪 {data?.name}'<span className="lowercase">s</span> Store</h1>

            {/* TODO: recall the api whenever a call is triggered for toggling a product modal */}
            {data._id && (
                <DashBoardStats
                    sellerId={data._id}
                    isAdmin={data?.isSuperAdmin}
                    load={showProductModal}
                />
            )}
            <div className="flex items-center border dark:border-neutral-700 p-3 rounded justify-start gap-3 dark:text-white">
                {/* My Products List */}
                <div>
                    <button
                        className="bg-gray-50 dark:bg-neutral-800 px-4 py-2 rounded border dark:border-neutral-700"
                        onClick={() => { setShowProductModal(true) }}>
                        Add product
                    </button>
                </div>

                {/* Add A Product */}
                <div>
                    <Link href={'/dashboard/ordersProcess'} className="bg-gray-50 dark:bg-neutral-800 px-4 py-2 rounded border dark:border-neutral-700">
                        Process Orders
                    </Link>
                </div>

                {/* Orders Completed */}
                <div>
                    <Link href={'/dashboard/ordersAction'} className="bg-gray-50 dark:bg-neutral-800 px-4 py-2 rounded border dark:border-neutral-700">
                        Order Actions
                    </Link>
                </div>

                {/* Custom Category */}
                <div>
                    <button
                        className="bg-gray-50 dark:bg-neutral-800 px-4 py-2 rounded border dark:border-neutral-700"
                        onClick={() => setShowCustomCategoryModal(true)}>
                        Add Category
                    </button>
                </div>


                {/* specialShow button */}
                {data?.isSuperAdmin && <div>
                    <button className="bg-gray-50 dark:bg-neutral-800 px-4 py-2 rounded border dark:border-neutral-700">
                        <Link href={"/dashboard/specialShow"} >
                            Special Appearence
                        </Link>
                    </button>
                </div>}

            </div>
            <div className=" flex items-center justify-end gap-3 pt-4">
                <button onClick={() => { setListView("grid") }} className="p-2 border rounded dark:border-neutral-700">
                    <LayoutGrid className="text-gray-600 dark:text-white h-5 w-5" />
                </button>
                <button onClick={() => { setListView("list") }} className="p-2 border rounded dark:border-neutral-700 ">
                    <LayoutList className="text-gray-600 dark:text-white h-5 w-5" />
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
        </div >
    );
};

export default Dashboard;
