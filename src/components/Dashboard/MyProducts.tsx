"use client";

import "swiper/css";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit, LoaderCircle, Minus, PackageSearch, PenLine, Plus, Star, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import EditDetailsModal from "../Modals/EditDetailsModal";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation } from "swiper/modules"
import Loader from "../Loaders/Loader";
import { useQuery } from "@tanstack/react-query";
import DeleteProductModal from "../Modals/DeleteProductModal";
import TableLayoutSkeleton from "../Skeletons/Dashboard/TableLayoutSkeleton";
import ApiClient from "@/interceptors/ApiClient";

interface reqSpecialAppearenceProps {
    _id: string;
    name: string;
    description: string;
    price: string;
    images: ["", "", ""];
    discount: string;
    seller: string;
}

interface MyProductsProps {
    sellerId: string;
    view: string;
}

interface prodDataProps {
    _id: string;
    name: string;
    description: string;
    seller: string;
    images: ["", "", ""];
    price: string;
    discount: string;
    size: string;
    containerType: string;
    category: string;
    stock: string;
}

const MyProducts = ({ sellerId, view }: MyProductsProps) => {
    const [page, setPage] = useState(1);
    const [editModal, setEditModal] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [oldName, setOldName] = useState("");
    const [oldDescripion, setOldDescripion] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [oldStock, setOldStock] = useState("");
    const [oldDiscount, setOldDiscount] = useState("");
    const [oldSize, setOldSize] = useState("");
    const [currentId, setCurrentId] = useState("");
    const [oldCategory, setOldCategory] = useState("");
    const [showMore, setShowMore] = useState<string | null>(null);
    const [reqLoader, setReqLoader] = useState(false);
    const [oldContainer, setOldContainer] = useState("");
    const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
    const [deleteName, setDeleteName] = useState("");
    const [productId, setProductId] = useState("");
    const [oldImages, setOldImages] = useState<string[]>([]);
    const [showFullDescription, setShowFullDescription] = useState(false);

    async function getSellerProducts() {
        try {
            const response = await ApiClient.post("/api/getSellerProducts", { sellerId, page });
            if (response.data?.data) {
                setTotalPages(response.data?.totalPages || 1);
                return response.data?.data || [];
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    const reqSpecialAppearence = async ({ _id, name, description, price, images, discount, seller, }: reqSpecialAppearenceProps) => {
        const data = { _id, name, description, price, images, discount, seller };
        try {
            setReqLoader(true);
            const response = await ApiClient.post("/api/reqSplAppear", { data });
            if (response.data.data) {
                toast.success("Request Sent");
                setReqLoader(false);
            } else {
                setReqLoader(false);
            }
            if (response.data.status === 422) {
                toast.success("already requested");
            }
        } catch (error: any) {
            setReqLoader(false);
            console.log("Error requesting ", error);
            if (
                error.response.data.error ===
                "You have already requested for this product"
            ) {
                toast.success("Already requested For This Product");
            } else {
                toast.error("Failed To Request for special Appearence");
            }
        }
    };

    const { data: prodData = [], isLoading,
        isError, } = useQuery({
            queryKey: ["sellerProducts", sellerId, page],
            queryFn: getSellerProducts,
            enabled: !!sellerId,
            refetchOnWindowFocus: false
        })

    return (
        <>
            {isError && <div className="flex items-center justify-center">Something Went Wrong</div>}
            {
                <>
                    {(view === "grid" && !isLoading)
                        &&
                        <div>
                            <div className="grid grid-cols-4 gap-10 py-4">
                                {prodData.map(
                                    ({ _id, name, description, images, price, discount, size, seller, category, containerType, stock }: prodDataProps) => {
                                        return (
                                            <div key={_id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 h-fit">
                                                {/* Image Gallery with Professional Controls */}
                                                <div className="relative aspect-square w-full bg-gray-50 dark:bg-neutral-900/30">
                                                    <Swiper
                                                        modules={[EffectFade, Pagination]}
                                                        pagination={{
                                                            clickable: true,
                                                            bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !mx-1 !bg-gray-300 dark:!bg-neutral-600',
                                                            bulletActiveClass: '!bg-gray-800 dark:!bg-white'
                                                        }}
                                                        spaceBetween={10}
                                                        effect="card"
                                                        className="h-full w-full"
                                                    >
                                                        {images.map((elem, index) => (
                                                            <SwiperSlide key={index}>
                                                                <div className="relative h-full w-full bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900">
                                                                    <Image
                                                                        src={elem}
                                                                        alt={`${name} product view ${index + 1}`}
                                                                        fill
                                                                        className="object-contain object-center"
                                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                        priority={index === 0}
                                                                    />
                                                                </div>
                                                            </SwiperSlide>
                                                        ))}

                                                        {/* Custom Navigation Arrows */}
                                                        <div className="swiper-button-next !right-2 !text-gray-700 dark:!text-neutral-300 after:!text-sm"></div>
                                                        <div className="swiper-button-prev !left-2 !text-gray-700 dark:!text-neutral-300 after:!text-sm"></div>
                                                    </Swiper>
                                                </div>

                                                {/* Product Information Section */}
                                                <div className="p-4">
                                                    <div className="mb-4">
                                                        <h3 title={name} className="text-lg font-semibold text-gray-900 line-clamp-2 dark:text-white capitalize h-14">
                                                            {name}
                                                        </h3>

                                                        {/* Description with Expand/Collapse */}
                                                        <div className="mt-2">
                                                            <button
                                                                onClick={() => setShowMore(showMore === _id ? null : _id)}
                                                                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
                                                                aria-expanded={showMore === _id}
                                                                aria-controls={`desc-${_id}`}
                                                            >
                                                                {showMore === _id ? (
                                                                    <>
                                                                        Hide details
                                                                        <ChevronUp className="w-4 h-4 mr-1.5" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        View details
                                                                        <ChevronDown className="w-4 h-4 mr-1.5" />
                                                                    </>
                                                                )}
                                                            </button>

                                                            <div
                                                                id={`desc-${_id}`}
                                                                className={`mt-1 text-sm text-gray-600 dark:text-neutral-400 ${showMore === _id ? 'block' : 'hidden'}`}
                                                            >
                                                                {description}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Pricing Information */}
                                                    <div className="mb-4 grid grid-cols-3 divide-x divide-gray-200 rounded-lg border border-gray-200 bg-gray-50 py-2 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/50">
                                                        <div className="px-2 text-center">
                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400">MRP</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">₹{price?.toLocaleString()}</p>
                                                        </div>
                                                        <div className="px-2 text-center">
                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400">Discount</p>
                                                            <p className="text-sm font-medium text-red-600 dark:text-red-400">-₹{discount?.toLocaleString()}</p>
                                                        </div>
                                                        <div className="px-2 text-center">
                                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400">Total</p>
                                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                                ₹{(Number(price) - Number(discount))?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="space-y-2">
                                                        <button
                                                            onClick={() => {
                                                                reqSpecialAppearence({
                                                                    _id,
                                                                    name,
                                                                    description,
                                                                    price,
                                                                    images,
                                                                    discount,
                                                                    seller,
                                                                });
                                                            }}
                                                            disabled={reqLoader}
                                                            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-600"
                                                        >
                                                            {reqLoader ? (
                                                                <>
                                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                                    Processing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Star className="mr-2 h-4 w-4" />
                                                                    Feature Product
                                                                </>
                                                            )}
                                                        </button>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditModal(true);
                                                                    setOldName(name);
                                                                    setOldPrice(price);
                                                                    setOldStock(stock);
                                                                    setOldDescripion(description);
                                                                    setOldDiscount(discount);
                                                                    setOldSize(size);
                                                                    setOldContainer(containerType);
                                                                    setCurrentId(_id);
                                                                    setOldCategory(category);
                                                                    setOldImages(images);
                                                                }}
                                                                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                                                            >
                                                                <PenLine className="h-4 w-4" />
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setDeleteName(name);
                                                                    setShowDeleteProductModal(true);
                                                                    setProductId(_id);
                                                                }}
                                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Modals - Positioned outside card for proper z-index */}
                                                <DeleteProductModal
                                                    isOpen={showDeleteProductModal}
                                                    onClose={() => setShowDeleteProductModal(false)}
                                                    productName={deleteName}
                                                    productId={productId}
                                                    sellerId={sellerId}
                                                />

                                                <EditDetailsModal
                                                    isVisible={editModal}
                                                    onClose={() => setEditModal(false)}
                                                    oldCategory={oldCategory}
                                                    oldName={oldName}
                                                    oldDescripion={oldDescripion}
                                                    oldPrice={oldPrice}
                                                    oldStock={oldStock}
                                                    oldDiscount={oldDiscount}
                                                    oldSize={oldSize}
                                                    oldImages={oldImages}
                                                    id={currentId}
                                                    oldContainer={oldContainer}
                                                />
                                            </div>
                                        );
                                    }
                                )}
                            </div >
                            {/* Pagination Buttons */}
                            {prodData?.length !== 0 && <div className="flex items-center justify-center gap-4 py-4">
                                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="flex items-center justify-center gap-1 px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700">
                                    <span><ChevronLeft className="w-4 h-4" /></span>  Previous
                                </button>
                                <span className="dark:text-gray-300">Page <span className="font-bold">{page}</span> of {totalPages}</span>
                                <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="flex items-center justify-center gap-1 px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700">
                                    Next <span><ChevronRight className="w-4 h-4" /></span>
                                </button>
                            </div>}
                        </div>
                    }

                    {/* List View Table Format */}
                    {(view === "list" && isLoading) && (<TableLayoutSkeleton />)}
                    {
                        (view === "list" && !isLoading) &&
                        (<div className="py-6">
                            <div className="overflow-hidden border rounded-lg dark:border-neutral-700">
                                <div className="overflow-auto no-scrollbar">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                        <thead className="bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900 dark:bg-neutral-800">
                                            <tr>
                                                <th scope="col" className="px-4 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-neutral-400">
                                                    Product
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-neutral-400">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">
                                                    Images
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">
                                                    Stock
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">
                                                    MRP
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">
                                                    Discount
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className=" divide-y divide-gray-200 dark:bg-neutral-850 dark:divide-neutral-700">
                                            {prodData.length > 0 ? (
                                                prodData.map(({ _id, name, description, images, price, discount, size, stock, category, containerType }: prodDataProps) => (
                                                    <tr key={_id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900 dark:text-white capitalize">
                                                                {name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-neutral-400 capitalize">{category}</div>
                                                        </td>
                                                        <td className="px-6 py-4 max-w-xs">
                                                            <p title={description} className={`text-gray-600 dark:text-neutral-300 text-sm ${showFullDescription ? '' : 'line-clamp-2'}`}>
                                                                {description}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex justify-center gap-2">
                                                                {images.slice(0, 3).map((img, idx) => (
                                                                    <div key={idx} className="relative w-10 h-10 overflow-hidden border rounded-md border-gray-200 dark:border-neutral-700">
                                                                        <Image
                                                                            src={img}
                                                                            alt={`Product image ${idx + 1}`}
                                                                            fill
                                                                            className="object-cover"
                                                                            sizes="40px"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-neutral-400 whitespace-nowrap">
                                                            {stock}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center text-gray-900 dark:text-white whitespace-nowrap">
                                                            ₹{price?.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-center text-gray-900 dark:text-white whitespace-nowrap">
                                                            ₹{discount?.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 dark:text-white whitespace-nowrap">
                                                            ₹{(Number(price) - Number(discount))?.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                                                            <div className="flex justify-center space-x-3">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditModal(true);
                                                                        setCurrentId(_id);
                                                                        setOldName(name);
                                                                        setOldPrice(price);
                                                                        setOldDescripion(description);
                                                                        setOldDiscount(discount);
                                                                        setOldSize(size);
                                                                        setOldStock(stock);
                                                                        setOldContainer(containerType);
                                                                        setOldCategory(category);
                                                                        setOldImages(images);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setDeleteName(name);
                                                                        setShowDeleteProductModal(true);
                                                                        setProductId(_id);
                                                                    }}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-neutral-400">
                                                        <div className="flex flex-col items-center justify-center py-8">
                                                            <PackageSearch className="w-12 h-12 text-gray-400 dark:text-neutral-600" />
                                                            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-neutral-400">No products found</p>
                                                            <p className="text-xs text-gray-400 dark:text-neutral-500">Add products to see them listed here</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {prodData.length > 0 && (
                                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-t dark:border-neutral-700">
                                        <div className="text-sm text-gray-500 dark:text-neutral-400">
                                            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-1" />
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={page === totalPages}
                                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modals */}
                            <DeleteProductModal
                                isOpen={showDeleteProductModal}
                                onClose={() => setShowDeleteProductModal(false)}
                                productName={deleteName}
                                productId={productId}
                                sellerId={sellerId}
                            />

                            <EditDetailsModal
                                isVisible={editModal}
                                oldCategory={oldCategory}
                                onClose={() => setEditModal(false)}
                                oldName={oldName}
                                oldDescripion={oldDescripion}
                                oldPrice={oldPrice}
                                oldDiscount={oldDiscount}
                                oldStock={oldStock}
                                oldSize={oldSize}
                                id={currentId}
                                oldImages={oldImages}
                                oldContainer={oldContainer}
                            />
                        </div>)
                    }
                </>
            }
        </>
    );
};

export default MyProducts;
