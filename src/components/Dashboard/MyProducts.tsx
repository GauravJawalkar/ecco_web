"use client";

import "swiper/css";
import axios from "axios";
import Image from "next/image";
import "swiper/css/pagination";
import toast from "react-hot-toast";
import { Edit, LoaderCircle, PenLine, Trash, Trash2 } from "lucide-react";
import { Key, useEffect, useState } from "react";
import EditDetailsModal from "../Modals/EditDetailsModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules"

interface reqSpecialAppearenceProps {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: [string];
    discount: number;
    seller: string;
}

interface MyProductsProps {
    sellerId: string;
    load: boolean;
    view: string;
}

const MyProducts = ({ sellerId, load, view }: MyProductsProps) => {
    const [prodData, setProdData] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [oldName, setOldName] = useState("");
    const [oldDescripion, setOldDescripion] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [oldDiscount, setOldDiscount] = useState("");
    const [oldSize, setOldSize] = useState("");
    const [currentId, setCurrentId] = useState("");
    const [showMore, setShowMore] = useState(null);
    const [reqLoader, setReqLoader] = useState(false);

    async function getSellerProducts() {
        try {
            const response = await axios.post("/api/getSellerProducts", { sellerId });
            setProdData(response.data.data);
        } catch (error) {
            console.log(error);
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

    useEffect(() => {
        getSellerProducts();
    }, [load]);

    return (
        <>
            {
                prodData.length === 0 ? (
                    <div className="text-center w-full py-5 animate-pulse font-semibold text-lg antialiased">
                        No Products Found
                    </div>
                ) : (
                    <>
                        {view === "grid"
                            &&
                            <div className="grid grid-cols-4 py-4 gap-10">
                                {prodData.map(
                                    ({ _id, name, description, images, price, discount, size, seller, }: any) => {
                                        return (
                                            <div key={_id} className="border p-5 dark:border-neutral-600 dark:bg-neutral-800">
                                                <div className="">
                                                    <Swiper
                                                        modules={[EffectFade, Pagination]}
                                                        pagination={{ clickable: true }}
                                                        spaceBetween={50}
                                                        effect="card"
                                                        className="border rounded dark:border-neutral-800"
                                                    >
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
                                                                            className="h-[300px] w-full object-fill rounded"
                                                                        />
                                                                    </SwiperSlide>
                                                                );
                                                            }
                                                        )}
                                                    </Swiper>
                                                    <div>
                                                        <h1 className="capitalize text-xl font-bold antialiased truncate p-2 border dark:border-neutral-500 my-3">
                                                            {name}
                                                        </h1>
                                                        <p
                                                            className={`text-base text-gray-500 
                                                        ${showMore === _id
                                                                    ? "line-clamp-2"
                                                                    : "hidden"
                                                                }`}
                                                        >
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
                                                                }}
                                                            >
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

                                                    <div className="grid grid-cols-3 py-2 border gap- place-items-center my-3 dark:border-neutral-500">
                                                        <div className="font-light ">
                                                            <label className="font-semibold"> MRP </label>
                                                            <h1>₹ {price}</h1>
                                                        </div>
                                                        <div className="font-light ">
                                                            <label className="font-semibold"> Discount</label>
                                                            <h1>- ₹ {discount}</h1>
                                                        </div>
                                                        <div className="font-light ">
                                                            <label className="font-semibold">Total </label>
                                                            <h1>₹ {price - discount}</h1>
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
                                                                setOldDescripion(description);
                                                                setOldDiscount(discount);
                                                                setOldSize(size);
                                                                setCurrentId(_id);
                                                            }}
                                                        >
                                                            Edit
                                                            <span>
                                                                <PenLine className="h-4 w-4" />
                                                            </span>
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 bg-red-500 hover:bg-red-700 transition-colors ease-in-out duration-200 rounded text-white flex items-center justify-center gap-2"
                                                            onClick={() => {
                                                                handelDelete(_id);
                                                            }}
                                                        >
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
                                                    oldName={oldName}
                                                    oldDescripion={oldDescripion}
                                                    oldPrice={oldPrice}
                                                    oldDiscount={oldDiscount}
                                                    oldSize={oldSize}
                                                    id={currentId}
                                                    reRender={() => {
                                                        return getSellerProducts();
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                )}
                            </div >
                        }

                        {/* List View Table Format */}
                        {
                            view === "list" &&
                            <div className="py-4">
                                <table className="min-w-full table-auto border border-gray-300 rounded-xl">
                                    <thead >
                                        <tr>
                                            <th className="px-4 py-2 border dark:border-neutral-700 text-start">Name</th>
                                            <th className="px-4 py-2 border dark:border-neutral-700 text-start">Description</th>
                                            <th className="px-4 py-2 border dark:border-neutral-700">Images</th>
                                            <th className="px-4 py-2 border dark:border-neutral-700">MRP</th>
                                            <th className="px-4 py-2 border dark:border-neutral-700">Discount</th>
                                            <th className="px-4 py-2 border dark:border-neutral-700">Total</th>
                                            <th className="px-4 py-2 border dark:border-neutral-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prodData.map(({
                                            _id,
                                            name,
                                            description,
                                            images,
                                            price,
                                            discount,
                                            size,
                                        }: any) => {
                                            return (
                                                <tr key={_id}>
                                                    <td className="px-4 py-2 border dark:border-neutral-700 text-start capitalize">{name}</td>
                                                    <td className="px-4 py-2 border dark:border-neutral-700 text-start w-1/5">{description}</td>
                                                    <td className="px-4 py-2 border dark:border-neutral-700 text-center">{
                                                        <div className="flex items-center justify-center gap-2">
                                                            < Image src={images[0]} alt="product-image" height={40} width={40} className="flex" />
                                                            < Image src={images[1]} alt="product-image" height={40} width={40} className="flex" />
                                                            < Image src={images[2]} alt="product-image" height={40} width={40} className="flex" />
                                                        </div>
                                                    }</td>
                                                    <td className="px-4 py-2 border dark:border-neutral-700 text-center">{price}</td>
                                                    <td className="px-4 py-2 border dark:border-neutral-700 text-center">{discount}</td>
                                                    <td className="px-4 py-2 border dark:border-neutral-700 text-center truncate ">{price - discount}</td>
                                                    <td className="px-4 py-2 border dark:border-neutral-700 text-center">
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
                                                                    setCurrentId(_id);
                                                                }} />
                                                            <Trash2 onClick={() => {
                                                                handelDelete(_id);
                                                            }} className="cursor-pointer text-red-500 hover:text-red-600" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>
                                <EditDetailsModal
                                    isVisible={editModal}
                                    onClose={() => {
                                        return setEditModal(false);
                                    }}
                                    oldName={oldName}
                                    oldDescripion={oldDescripion}
                                    oldPrice={oldPrice}
                                    oldDiscount={oldDiscount}
                                    oldSize={oldSize}
                                    id={currentId}
                                    reRender={() => {
                                        return getSellerProducts();
                                    }}
                                />
                            </div>
                        }
                    </>
                )
            }


        </>
    );
};

export default MyProducts;
