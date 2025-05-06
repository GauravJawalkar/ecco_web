"use client";

import { useUserStore } from "@/store/UserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

interface cartMappingProps {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    discount: number;
    sellerName: string;
}

const Cart = () => {
    const { data }: any = useUserStore();
    const cartOwnerId = data?._id;
    const queryClient = useQueryClient();
    const [quantityOperation, setQuantityOperation] = useState("")

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
            const cartId = userCart?._id;
            const response = await axios.put('/api/removeCartItem',
                { data: { cartId, _id, } });
            if (response.data.data) {
                return response.data.data
            };

            return [];
        } catch (error) {
            console.error("Failed to remove the item from the cart : ", error);
            return [];
        }
    }

    const removeItemMutation = useMutation({
        mutationFn: removeCartItem,
        onSuccess: () => {
            toast.success("Item Removed");
            queryClient.invalidateQueries({ queryKey: ['userCart'] })
        }
    })

    const handelRemoveItem = (_id: string) => {
        removeItemMutation.mutate(_id);
    }

    async function addItemQuantity(_id: string, quantity: number) {
        try {
            const cartId = userCart?._id;
            const response = await axios.put('api/updateCart', { data: { _id, quantityOperation, cartId, quantity } });
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error updating the quantity : ", error);
        }
    }

    const addQuantityMutation = useMutation(
        {
            mutationFn: ({ _id, quantity }: { _id: string, quantity: number }) => addItemQuantity(_id, quantity),
            onSuccess: () => {
                toast.success("Item Added");
                queryClient.invalidateQueries({ queryKey: ['userCart'] });
            }
        }
    )

    const handelAddItemQuantity = (_id: string, quantity: number) => {
        addQuantityMutation.mutate({ _id, quantity });
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
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        setQuantityOperation("+");
                                                        handelAddItemQuantity(_id, quantity)
                                                    }} className="p-1 border-2 rounded-full dark:border-neutral-700">
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                    <h1 className="text-sm py-1 px-2 dark:border-neutral-700 rounded border">{quantity}</h1>
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        setQuantityOperation("-");
                                                        handelAddItemQuantity(_id, quantity)
                                                    }} className="p-1 border-2 rounded-full dark:border-neutral-700">
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); handelRemoveItem(_id) }} className="text-sm">REMOVE ITEM</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                </div>
                <div className="w-full p-5 border rounded my-3 uppercase dark:border-neutral-700">Cart Total : 0</div>
            </div>
        </section >
    );
};

export default Cart;
