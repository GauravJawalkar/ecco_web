"use client";

import { useUserStore } from "@/store/UserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface cartMappingProps {
    name: string;
    price: number;
    image: string;
    quantity: number;
    discount: number;
    sellerName: string;
    _id: string
}

const Cart = () => {
    const { data }: any = useUserStore();
    const cartOwnerId = data?._id;

    async function getCartItems() {
        try {
            const response = await axios.get(`../../api/getCart/${cartOwnerId}`);
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error getting the cart details :", error);
            return [];
        }
    }

    const { data: userCart = [] } = useQuery({
        queryFn: getCartItems,
        queryKey: ["userCart", cartOwnerId],
        enabled: !!cartOwnerId,
        refetchOnWindowFocus: false,
    });

    async function removeCartItem(_id: string) {
        try {

        } catch (error) {
            console.error("Failed to remove the item from the cart : ", error);
            toast.error("Failed to remove the item");
        }
    }

    const handelRemoveItem = (_id: string) => {

    }
    return (
        <section>
            {userCart?.cartItems?.length > 0 ? (
                <div className="text-2xl font-semibold text-center py-10">
                    Your Cart
                </div>
            ) : (
                <div className="text-2xl font-semibold text-center py-10">
                    Your Cart Is Empty
                </div>
            )}
            <div className="grid grid-cols-[3fr_1fr] gap-4">
                <div>
                    {userCart?.cartItems?.length > 0 &&
                        userCart?.cartItems?.map(
                            ({ name, price, image, quantity, discount, sellerName, _id }: cartMappingProps) => {
                                return (
                                    <div
                                        className="flex items-start justify-start flex-col p-5 border rounded dark:border-neutral-700 gap-3 my-3"
                                        key={name + price}>
                                        <div className="flex gap-3">
                                            <Image
                                                width={200}
                                                height={200}
                                                src={image || "/userProfile.png"}
                                                alt={"cartImage"}
                                                className="h-24 w-20 rounded border-2 object-cover"
                                            />
                                            <div className="flex items-start justify-start flex-col ">
                                                <h1 className="capitalize text-xl font-semibold">{name}</h1>
                                                <h1 className="text-md text-gray-500">
                                                    Price: ₹ {price - discount}
                                                </h1>
                                                <h1 className="text-md text-gray-500 capitalize">
                                                    Seller: {sellerName}
                                                </h1>
                                                <h1 className="text-md text-gray-500">
                                                    Delivery: Free 😊
                                                </h1>
                                                <div className="py-3 flex items-center gap-3">
                                                    <button className="p-1 border-2 rounded-full dark:border-neutral-700">
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                    <h1 className="text-sm py-1 px-2 dark:border-neutral-700 rounded border">{quantity}</h1>
                                                    <button className="p-1 border-2 rounded-full dark:border-neutral-700">
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => { handelRemoveItem(_id) }} className="text-sm">REMOVE ITEM</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                </div>
                <div className="w-full p-5 border rounded my-3 dark:border-neutral-700">Cart Total</div>
            </div>
        </section>
    );
};

export default Cart;
