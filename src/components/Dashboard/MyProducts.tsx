"use client";

import "swiper/css";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Edit, LoaderCircle, PenLine, Trash, Trash2 } from "lucide-react";
import { Key, useState } from "react";
import EditDetailsModal from "../Modals/EditDetailsModal";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules"
import Loader from "../Loaders/Loader";
import { useQuery } from "@tanstack/react-query";

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
    load: boolean;
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

    async function getSellerProducts() {
        try {
            const response = await axios.post("/api/getSellerProducts", { sellerId, page });
            if (response.data.data) {
                setTotalPages(response.data.totalPages || 1);
                return response.data.data || [];
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const handelDelete = async (productId: string) => {
        try {
            const response = await axios.delete("api/deleteProduct", {
                data: { sellerId, productId },
            });

            if (response.data.product) {
                toast.success("Product Deleted");
            }

            await getSellerProducts();
        } catch (error) {
            toast.error("Failed to delete the product. Try Again");
            console.log(error);
        }
    };

    const reqSpecialAppearence = async ({ _id, name, description, price, images, discount, seller, }: reqSpecialAppearenceProps) => {
        const data = { _id, name, description, price, images, discount, seller };
        try {
            setReqLoader(true);
            const response = await axios.post("api/reqSplAppear", { data });
            if (response.data.data) {
                toast.success("Request Sent");
                setReqLoader(false);
            } else {
                console.log("logging ", response.data.error);
                setReqLoader(false);
            }
            if (response.data.status === 401) {
                console.log("logging ", response.data.error);
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
            {isLoading && <div className="flex items-center justify-center"><Loader title="Fetching..." /></div>}
            {isError && <div className="flex items-center justify-center">Something Went Wrong</div>}
            {
                <>
                    {(view === "grid" && !isLoading)
                        &&
                        <div>
                            <div className="grid grid-cols-4 py-4 gap-10">
                                {prodData.map(
                                    ({ _id, name, description, images, price, discount, size, seller, category, containerType, stock }: prodDataProps) => {
                                        return (
                                            <div key={_id} className="border p-5 rounded dark:border-neutral-600 dark:bg-neutral-800">
                                                <div>
                                                    <Swiper
                                                        modules={[EffectFade, Pagination]}
                                                        pagination={{ clickable: true }}
                                                        spaceBetween={50}
                                                        effect="card"
                                                        className="border rounded dark:border-neutral-700">
                                                        {images.map(
                                                            (elem: string, index: Key | null | undefined) => {
                                                                return (
                                                                    <SwiperSlide key={index} className="">
                                                                        <Image
                                                                            src={elem}
                                                                            loading="lazy"
                                                                            alt="image prod"
                                                                            width={300}
                                                                            height={200}
                                                                            className="h-[300px] w-full object-contain rounded" />
                                                                    </SwiperSlide>);
                                                            })}
                                                    </Swiper>
                                                    <div>
                                                        <h1 className="capitalize text-xl font-bold antialiased truncate my-3">
                                                            {name}
                                                        </h1>
                                                        <p className={`text-base text-gray-500 
                                                        ${showMore === _id
                                                                ? "line-clamp-2"
                                                                : "hidden"
                                                            }`}>
                                                            {description}
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 px-2">
                                                        <div>
                                                            <button
                                                                className="text-sm text-blue-700 hover:text-blue-500"
                                                                title="Show Description"
                                                                onClick={() =>
                                                                    setShowMore(showMore === _id ? null : _id)
                                                                }
                                                            >
                                                                Show Desc..
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button
                                                                className="text-sm text-blue-700 hover:text-blue-500"
                                                                title="Request for special appearence"
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
                                                                }}>
                                                                {reqLoader ? (
                                                                    <span className="flex items-center justify-center gap-2">
                                                                        <LoaderCircle className="animate-spin text-blue-500" />
                                                                        "Req.."
                                                                    </span>
                                                                ) : (
                                                                    <span>Req Appear ?</span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 py-2 border gap- place-items-center my-3 dark:border-neutral-700 rounded">
                                                        <div className="font-light ">
                                                            <label className="font-semibold"> MRP </label>
                                                            <h1>₹ {price?.toLocaleString()}</h1>
                                                        </div>
                                                        <div className="font-light ">
                                                            <label className="font-semibold"> Discount</label>
                                                            <h1> - ₹ {discount?.toLocaleString()}</h1>
                                                        </div>
                                                        <div className="font-light ">
                                                            <label className="font-semibold">Total </label>
                                                            <h1>₹ {(Number(price) - Number(discount))?.toLocaleString()}</h1>
                                                        </div>
                                                    </div>

                                                    {/* Functionality buttons */}
                                                    <div className="py-2 grid grid-cols-2 gap-3 bottom-0">
                                                        <button
                                                            className="px-3 py-1 bg-green-500 hover:bg-green-700 transition-colors ease-in-out duration-200 rounded text-white flex items-center justify-center gap-2"
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
                                                                setOldCategory(category)
                                                            }}>
                                                            Edit
                                                            <span>
                                                                <PenLine className="h-4 w-4" />
                                                            </span>
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 bg-red-500 hover:bg-red-700 transition-colors ease-in-out duration-200 rounded text-white flex items-center justify-center gap-2"
                                                            onClick={() => {
                                                                handelDelete(_id);
                                                            }}>
                                                            Delete
                                                            <span>
                                                                <Trash className="h-4 w-4" />
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <EditDetailsModal
                                                    isVisible={editModal}
                                                    onClose={() => {
                                                        return setEditModal(false);
                                                    }}
                                                    oldCategory={oldCategory}
                                                    oldName={oldName}
                                                    oldDescripion={oldDescripion}
                                                    oldPrice={oldPrice}
                                                    oldStock={oldStock}
                                                    oldDiscount={oldDiscount}
                                                    oldSize={oldSize}
                                                    id={currentId}
                                                    oldContainer={oldContainer} />
                                            </div>
                                        );
                                    }
                                )}
                            </div >
                            {/* Pagination Buttons */}
                            <div className="flex justify-center items-center gap-4 py-4">
                                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                                    <span><ChevronLeft className="h-4 w-4" /></span>  Previous
                                </button>
                                <span className="dark:text-gray-300">Page <span className="font-bold">{page}</span> of {totalPages}</span>
                                <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                                    Next <span><ChevronRight className="h-4 w-4" /></span>
                                </button>
                            </div>
                        </div>
                    }

                    {/* List View Table Format */}
                    {
                        (view === "list" && !isLoading) &&
                        <div className="py-4">
                            <table className="min-w-full table-auto border border-gray-300 rounded-xl">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className="px-4 py-2 border dark:border-neutral-700 text-start">Name</th>
                                        <th colSpan={2} className="px-4 py-2 border dark:border-neutral-700 text-start">Description</th>
                                        <th colSpan={2} className="px-4 py-2 border dark:border-neutral-700">Images</th>
                                        <th colSpan={1} className="px-4 py-2 border dark:border-neutral-700">Stock</th>
                                        <th colSpan={1} className="px-4 py-2 border dark:border-neutral-700">MRP</th>
                                        <th colSpan={1} className="px-4 py-2 border dark:border-neutral-700">Discount</th>
                                        <th colSpan={1} className="px-4 py-2 border dark:border-neutral-700">Total</th>
                                        <th colSpan={2} className="px-4 py-2 border dark:border-neutral-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prodData.map(({ _id, name, description, images, price, discount, size, stock, category, containerType }: prodDataProps) => {
                                        return (
                                            <tr key={_id}>
                                                <td colSpan={2} className="px-4 py-2 border dark:border-neutral-700 text-start capitalize">{name}</td>
                                                <td colSpan={2} className="px-4 py-2 border dark:border-neutral-700 text-start capitalize ">
                                                    <div className="line-clamp-2">
                                                        {description}
                                                    </div>
                                                </td>
                                                <td colSpan={2} className="px-4 py-2 border dark:border-neutral-700 text-center w-1/6">
                                                    {
                                                        <div className="flex items-center justify-center gap-2 w-full">
                                                            < Image src={images[0]} alt="product-image" height={40} width={40} />
                                                            < Image src={images[1]} alt="product-image" height={40} width={40} />
                                                            < Image src={images[2]} alt="product-image" height={40} width={40} />
                                                        </div>
                                                    }
                                                </td>
                                                <td colSpan={1} className="px-4 py-2 border dark:border-neutral-700 text-center">{stock}</td>
                                                <td colSpan={1} className="px-4 py-2 border dark:border-neutral-700 text-center">{price?.toLocaleString()}</td>
                                                <td colSpan={1} className="px-4 py-2 border dark:border-neutral-700 text-center">{discount?.toLocaleString()}</td>
                                                <td colSpan={1} className="px-4 py-2 border dark:border-neutral-700 text-center truncate ">{(Number(price) - Number(discount))?.toLocaleString()}</td>
                                                <td colSpan={2} className="px-4 py-2 border dark:border-neutral-700 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Edit
                                                            className="cursor-pointer text-green-500 hover:text-green-600"
                                                            onClick={() => {
                                                                setEditModal(!editModal);
                                                                setOldName(name);
                                                                setOldPrice(price);
                                                                setOldDescripion(description);
                                                                setOldDiscount(discount);
                                                                setOldSize(size);
                                                                setOldStock(stock);
                                                                setCurrentId(_id);
                                                                setOldContainer(containerType);
                                                                setOldCategory(category)
                                                            }} />
                                                        <Trash2 onClick={() => {
                                                            handelDelete(_id);
                                                        }} className="cursor-pointer text-red-500 hover:text-red-600" />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {/* Pagination Buttons */}
                            <div className="flex justify-center items-center gap-2 mt-4">
                                <button title="Previous" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="p-3 border rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                Page<span className="font-bold">{page}</span> of {totalPages}
                                <button title="Next" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="p-3 border rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                            <EditDetailsModal
                                isVisible={editModal}
                                oldCategory={oldCategory}
                                onClose={() => { return setEditModal(false) }}
                                oldName={oldName}
                                oldDescripion={oldDescripion}
                                oldPrice={oldPrice}
                                oldDiscount={oldDiscount}
                                oldStock={oldStock}
                                oldSize={oldSize}
                                id={currentId}
                                oldContainer={oldContainer} />
                        </div>
                    }
                </>
            }
        </>
    );
};

export default MyProducts;
