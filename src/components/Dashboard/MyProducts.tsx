"use client";

import "swiper/css";
import Image from "next/image";
import toast from "react-hot-toast";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit, LoaderCircle, PackageSearch, PenLine, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import EditDetailsModal from "../Modals/EditDetailsModal";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules"
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

    const reqSpecialAppearence = async ({ _id, name, description, price, images, discount, seller }: reqSpecialAppearenceProps) => {
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
            if (error.response.data.error === "You have already requested for this product") {
                toast.success("Already requested For This Product");
            } else {
                toast.error("Failed To Request for special Appearence");
            }
        }
    };

    const { data: prodData = [], isLoading, isError } = useQuery({
        queryKey: ["sellerProducts", sellerId, page],
        queryFn: getSellerProducts,
        enabled: !!sellerId,
        refetchOnWindowFocus: false
    });

    const openEditModal = (product: prodDataProps) => {
        setEditModal(true);
        setOldName(product.name);
        setOldPrice(product.price);
        setOldStock(product.stock);
        setOldDescripion(product.description);
        setOldDiscount(product.discount);
        setOldSize(product.size);
        setOldContainer(product.containerType);
        setCurrentId(product._id);
        setOldCategory(product.category);
        setOldImages(product.images);
    };

    const openDeleteModal = (name: string, id: string) => {
        setDeleteName(name);
        setShowDeleteProductModal(true);
        setProductId(id);
    };

    return (
        <>
            {isError && <div className="flex items-center justify-center">Something Went Wrong</div>}

            {/* Grid View */}
            {view === "grid" && !isLoading && (
                <div>
                    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-5 py-4 ">
                        {prodData.map((product: prodDataProps) => {
                            const { _id, name, description, images, price, discount, size, seller, category, containerType, stock } = product;
                            return (
                                <div key={_id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 h-fit flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-square sm:aspect-[4/3] w-full bg-gray-50 dark:bg-neutral-900/30">
                                        <Swiper
                                            modules={[EffectFade, Pagination]}
                                            pagination={{
                                                clickable: true,
                                                bulletClass: 'swiper-pagination-bullet !w-1.5 !h-1.5 !mx-0.5 !bg-gray-300 dark:!bg-neutral-600',
                                                bulletActiveClass: '!bg-gray-800 dark:!bg-white'
                                            }}
                                            spaceBetween={10}
                                            className="h-full w-full"
                                        >
                                            {images.map((elem, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className="relative h-full w-full bg-white dark:bg-neutral-900 flex items-center justify-center sm:p-6">
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={elem}
                                                                alt={`${name} view ${index + 1}`}
                                                                fill
                                                                className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                                                                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 25vw"
                                                                priority={index === 0}
                                                            />
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                    {/* Info */}
                                    <div className="p-1.5 sm:p-4 flex flex-col flex-grow bg-gradient-to-br from-white/90 to-gray-100 dark:border-neutral-700 border-t dark:from-neutral-800/90 dark:to-neutral-900">
                                        <h3 title={name} className="text-[10px] sm:text-base font-normal text-gray-900 line-clamp-2 dark:text-white capitalize mb-0.5 h-7 lg:h-12 sm:mb-0">
                                            {name}
                                        </h3>

                                        {/* Description toggle — desktop only */}
                                        <div className="my-2 hidden sm:block">
                                            <button
                                                onClick={() => setShowMore(showMore === _id ? null : _id)}
                                                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
                                            >
                                                {showMore === _id ? (
                                                    <>Hide details <ChevronUp className="w-4 h-4 ml-1" /></>
                                                ) : (
                                                    <>View details <ChevronDown className="w-4 h-4 ml-1" /></>
                                                )}
                                            </button>
                                            <div className={`mt-1 text-sm text-gray-600 dark:text-neutral-400 ${showMore === _id ? 'block' : 'hidden'}`}>
                                                {description}
                                            </div>
                                        </div>

                                        {/* Pricing — mobile: compact single line */}
                                        <div className="sm:hidden flex items-center justify-between my-1">
                                            <span className="text-[9px] text-gray-400 dark:text-neutral-500 line-through">₹{Number(price)?.toLocaleString()}</span>
                                            <span className="text-[10px] font-bold text-green-600 dark:text-green-400">₹{(Number(price) - Number(discount))?.toLocaleString()}</span>
                                        </div>

                                        {/* Pricing — desktop: full 3-col grid */}
                                        <div className="hidden sm:grid mb-4 grid-cols-3 divide-x divide-gray-200 rounded-lg border border-gray-200 bg-gray-50 py-2 dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/50">
                                            <div className="px-2 text-center">
                                                <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400">MRP</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">₹{Number(price)?.toLocaleString()}</p>
                                            </div>
                                            <div className="px-2 text-center">
                                                <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400">Discount</p>
                                                <p className="text-sm font-medium text-red-600 dark:text-red-400">-₹{Number(discount)?.toLocaleString()}</p>
                                            </div>
                                            <div className="px-2 text-center">
                                                <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400">Total</p>
                                                <p className="text-sm font-medium text-green-600 dark:text-green-400">₹{(Number(price) - Number(discount))?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto">
                                            {/* Mobile: 3 icon-only buttons */}
                                            <div className="flex sm:hidden items-center gap-1.5">
                                                <button
                                                    onClick={() => reqSpecialAppearence({ _id, name, description, price, images, discount, seller })}
                                                    disabled={reqLoader}
                                                    title="Feature"
                                                    className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/40 hover:bg-green-100 transition-colors disabled:opacity-50">
                                                    {reqLoader ? <LoaderCircle className="w-3 h-3 animate-spin" /> : <Star className="w-3 h-3" />}
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    title="Edit"
                                                    className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-gray-50 dark:bg-neutral-700/50 text-gray-500 dark:text-neutral-400 border border-gray-200 dark:border-neutral-600 hover:bg-gray-100 transition-colors">
                                                    <PenLine className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(name, _id)}
                                                    title="Delete"
                                                    className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Desktop: full labeled buttons */}
                                            <div className="hidden sm:block space-y-2">
                                                <button
                                                    onClick={() => reqSpecialAppearence({ _id, name, description, price, images, discount, seller })}
                                                    disabled={reqLoader}
                                                    className="flex w-full min-h-[40px] items-center justify-center rounded-lg bg-green-600 px-2 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-green-700 dark:hover:bg-green-800">
                                                    {reqLoader
                                                        ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                                                        : <><Star className="mr-2 h-4 w-4" />Feature</>}
                                                </button>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="flex items-center justify-center gap-2 min-h-[40px] rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
                                                        <PenLine className="h-4 w-4" />Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(name, _id)}
                                                        className="flex items-center justify-center gap-2 min-h-[40px] rounded-lg bg-red-50 px-2 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40">
                                                        <Trash2 className="h-4 w-4" />Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid Pagination */}
                    {prodData?.length !== 0 && (
                        <div className="flex items-center justify-center gap-4 py-4">
                            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700">
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>
                            <span className="dark:text-gray-300">Page <span className="font-bold">{page}</span> of {totalPages}</span>
                            <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700">
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Grid Modals */}
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
            )}

            {/* List View */}
            {view === "list" && isLoading && <TableLayoutSkeleton />}
            {view === "list" && !isLoading && (
                <div className="py-6">
                    <div className="overflow-hidden border rounded-lg dark:border-neutral-700">
                        <div className="overflow-auto no-scrollbar">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                <thead className="bg-gradient-to-br from-white/90 to-gray-100 dark:from-neutral-800/90 dark:to-neutral-900">
                                    <tr>
                                        <th className="px-4 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-neutral-400">Product</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase dark:text-neutral-400">Description</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">Images</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">Stock</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">MRP</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">Discount</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">Price</th>
                                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-500 uppercase dark:text-neutral-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:bg-neutral-850 dark:divide-neutral-700">
                                    {prodData.length > 0 ? (
                                        prodData.map((product: prodDataProps) => {
                                            const { _id, name, description, images, price, discount, size, stock, category, containerType } = product;
                                            return (
                                                <tr key={_id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900 dark:text-white capitalize">{name}</div>
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
                                                                    <Image src={img} alt={`Product image ${idx + 1}`} fill className="object-cover" sizes="40px" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center text-gray-500 dark:text-neutral-400 whitespace-nowrap">{stock}</td>
                                                    <td className="px-6 py-4 text-sm text-center text-gray-900 dark:text-white whitespace-nowrap">₹{Number(price)?.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-sm text-center text-gray-900 dark:text-white whitespace-nowrap">₹{Number(discount)?.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 dark:text-white whitespace-nowrap">₹{(Number(price) - Number(discount))?.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                                                        <div className="flex justify-center space-x-3">
                                                            <button onClick={() => openEditModal(product)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Edit">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => openDeleteModal(name, _id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center">
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

                        {/* List Pagination */}
                        {prodData.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-neutral-800 border-t dark:border-neutral-700">
                                <div className="text-sm text-gray-500 dark:text-neutral-400">
                                    Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <ChevronLeft className="w-4 h-4 mr-1" />Previous
                                    </button>
                                    <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Next<ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* List Modals */}
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
                </div>
            )}
        </>
    );
};

export default MyProducts;