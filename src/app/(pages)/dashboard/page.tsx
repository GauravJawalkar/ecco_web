"use client";

import AddProductModal from "@/components/AddProductModal";
import CustomCategoryModal from "@/components/CustomCategoryModal";
import DashBoardStats from "@/components/DashBoardStats";
import MyProducts from "@/components/MyProducts";
import { useUserStore } from "@/store/UserStore";
import Link from "next/link";
import { useState } from "react";

const Dashboard = () => {
    const { data }: any = useUserStore();
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);

    return (
        <div>
            {/* TODO: recall the api whenever a call is triggered for toggling a product modal */}
            {data._id ? (
                <DashBoardStats
                    sellerId={data._id}
                    isAdmin={data?.isSuperAdmin}
                    load={showProductModal}
                />
            ) : (
                ""
            )}
            <div className="flex items-center border p-3 rounded justify-start gap-3 dark:text-neutral-800">
                {/* My Products List */}
                <div>
                    <button
                        className="bg-gray-50 px-4 py-2 rounded border"
                        onClick={() => {
                            setShowProductModal(true);
                        }}
                    >
                        Add product
                    </button>
                </div>

                {/* Add A Product */}
                <div>
                    <button className="bg-gray-50 px-4 py-2 rounded border">
                        Orders Processing
                    </button>
                </div>

                {/* Orders Completed */}
                <div>
                    <button className="bg-gray-50 px-4 py-2 rounded border">
                        Orders Completed
                    </button>
                </div>

                {/* Custom Category */}
                <div>
                    <button
                        className="bg-gray-50 px-4 py-2 rounded border"
                        onClick={() => setShowCustomCategoryModal(true)}
                    >
                        Add Category
                    </button>
                </div>


                {/* specialShow button */}
                <div>
                    <button className="bg-gray-50 px-4 py-2 rounded border">
                        <Link href={"/dashboard/specialShow"} >
                            Special Appearence
                        </Link>
                    </button>
                </div>

            </div>
            <AddProductModal
                isVisible={showProductModal}
                onClose={() => {
                    setShowProductModal(false);
                }}
            />
            {
                data._id ? (
                    <CustomCategoryModal
                        isVisible={showCustomCategoryModal}
                        onClose={() => setShowCustomCategoryModal(false)}
                        creator={data?._id}
                    />
                ) : (
                    ""
                )
            }
            {
                data._id ? (
                    <MyProducts load={showProductModal} sellerId={data?._id} />
                ) : (
                    ""
                )
            }
        </div >
    );
};

export default Dashboard;
