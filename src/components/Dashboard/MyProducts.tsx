"use client";

import "swiper/css";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import "swiper/css/pagination";
import toast from "react-hot-toast";
import { LoaderCircle, PenLine, Trash } from "lucide-react";
import { Key, useEffect, useState } from "react";
import EditDetailsModal from "../Modals/EditDetailsModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";

interface reqSpecialAppearenceProps {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: [string];
    discount: number;
    seller: string;
}

const MyProducts = ({
    sellerId,
    load,
}: {
    sellerId: string;
    load: boolean;
}) => {
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

    const reqSpecialAppearence = async ({
        _id,
        name,
        description,
        price,
        images,
        discount,
        seller,
    }: reqSpecialAppearenceProps) => {
        const data = {
            _id,
            name,
            description,
            price,
            images,
            discount,
            seller,
        };
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
            if (error.response.data.error === "You have already requested for this product") {
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
            {prodData.length === 0 ? (
                <div className="text-center w-full py-10 animate-pulse font-semibold text-lg antialiased">
                    No Products Found
                </div>
            ) : (
                <div className="grid grid-cols-4 py-10 gap-10">
                    {prodData.map(
                        ({
                            _id,
                            name,
                            description,
                            images,
                            price,
                            discount,
                            size,
                            seller,
                        }: any) => {
                            return (
                                <div key={_id} className="border p-5 dark:border-gray-500">
                                    <div className="">
                                        <Swiper
                                            modules={[EffectFade, Pagination]}
                                            pagination={{ clickable: true }}
                                            spaceBetween={50}
                                            effect="card"
                                            className="border rounded dark:border-gray-500"
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
                                                                className="h-[300px] w-full object-cover rounded"
                                                            />
                                                        </SwiperSlide>
                                                    );
                                                }
                                            )}
                                        </Swiper>
                                        <div>
                                            <h1 className="capitalize text-xl font-bold antialiased line-clamp-2 p-2 border dark:border-neutral-500 my-3">
                                                {name}
                                            </h1>
                                            <p
                                                className={`text-base text-gray-500 
                                                    ${showMore===_id
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
                                                    onClick={() => setShowMore(showMore === _id ? null : _id)}
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

                                        <div className="grid grid-cols-3 p-2 border gap-2 place-items-center my-3 dark:border-neutral-500">
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
                                        <div className="py-2 grid grid-cols-2 gap-3">
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
                </div>
            )}
        </>
    );
};

export default MyProducts;
