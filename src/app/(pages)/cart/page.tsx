"use client";

import { useUserStore } from "@/store/UserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface cartMappingProps {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
    discount: number;
    sellerName: string;
    productId: string
}

const Cart = () => {
    const { data }: any = useUserStore();
    const cartOwnerId = data?._id;
    const queryClient = useQueryClient();
    const [quantityOperation, setQuantityOperation] = useState("");
    const [cartTotal, setCartTotal] = useState(0);
    const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
    const router = useRouter();

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
                toast.success("Quantity Updated");
                queryClient.invalidateQueries({ queryKey: ['userCart'] });
            }
        }
    )

    const handelAddItemQuantity = (_id: string, quantity: number) => {
        addQuantityMutation.mutate({ _id, quantity });
    }

    // useEffect to calculate the total cart checkout
    useEffect(() => {
        if (userCart?.cartItems?.length > 0) {
            const subtotal = userCart.cartItems.reduce((total: number, item: cartMappingProps) => {
                return total + (item.price - item.discount) * item.quantity;
            }, 0);
            setCartTotal(subtotal);
        } else {
            setCartTotal(0);
        }
    }, [userCart]);

    // For checking out the whole cart : The Approach :-> Just take the whole array of cartItems and save it in the database then map it in the checkout page and create an order depending on the number of product present
    return (
        <section>
            {userCart?.cartItems?.length > 0 ? (
                <div className="py-10 text-2xl font-semibold text-center uppercase">
                    My Shopping Cart
                </div>
            ) : (
                <div className="py-10 text-2xl font-semibold text-center uppercase">
                    Your Cart Is Empty
                </div>
            )}
            <div className="grid grid-cols-[3fr_1fr] gap-4">
                <div className="grid grid-cols-2 gap-4">
                    {userCart?.cartItems?.length > 0 &&
                        userCart?.cartItems?.map(
                            ({ name, price, image, quantity, discount, sellerName, _id, stock, productId }: cartMappingProps) => {
                                return (
                                    <Link href={`/products/${slugify(name)}?id=${productId}`} className="relative gap-3 p-5 border rounded-2xl dark:border-neutral-700 dark:bg-neutral-700/20 h-fit" key={name + price}>
                                        <div>
                                            <div className="flex gap-3">
                                                <Image
                                                    width={200}
                                                    height={200}
                                                    src={image || "/userProfile.png"}
                                                    alt={"cartImage"}
                                                    className="object-cover border-2 h-36 w-28 rounded-xl dark:border-neutral-700"
                                                />
                                                <div className="flex flex-col items-start justify-start">
                                                    <h1 className="text-xl font-semibold capitalize line-clamp-1" title={name}>{name}</h1>
                                                    <h1 className="text-gray-500 text-md">
                                                        Price: ₹ {(price - discount)?.toLocaleString()}
                                                    </h1>
                                                    <h1 className="text-gray-500 capitalize text-md">
                                                        Seller: {sellerName}
                                                    </h1>
                                                    <h1 className="text-gray-500 text-md">
                                                        Delivery: Free 😊
                                                    </h1>
                                                    <div className="flex items-center gap-3 py-3">
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setQuantityOperation("+");
                                                            handelAddItemQuantity(_id, quantity);
                                                        }} className="p-1 border-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 dark:border-neutral-700">
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                        <h1 className="px-2 py-1 text-sm border rounded dark:border-neutral-700">{quantity}</h1>
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setQuantityOperation("-");
                                                            handelAddItemQuantity(_id, quantity);
                                                        }} className="p-1 border-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700 dark:border-neutral-700">
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handelRemoveItem(_id)
                                                        }} className="px-2 py-1 text-sm border rounded dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700">REMOVE ITEM</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-[#1a1a1a] rounded-full absolute -top-3 -right-2">
                                            {
                                                stock >= 10 ? (<h1 className="py-[2px] px-2 border rounded-lg text-green-500 border-green-500 text-sm bg-green-100">In Stock</h1>) : (
                                                    stock === 0 ? <h1 className="py-[2px] px-2 border rounded-lg text-red-500 border-red-500 text-sm bg-red-100">Out Of Stock</h1> :
                                                        <h1 className="py-[2px] px-2 border rounded-lg text-amber-500 border-amber-500 text-sm bg-amber-100">Few Left</h1>)
                                            }
                                        </div>
                                    </Link>
                                );
                            }
                        )}
                </div>
                <div className={` ${userCart?.cartItems?.length <= 0 ? "hidden" : " w-full p-5 border rounded-2xl my-3  dark:border-neutral-700 h-fit sticky top-24"}`}>
                    <h1 className="text-lg font-semibold uppercase">
                        CART Summary :
                    </h1>

                    <div className="flex items-center justify-between pt-10">
                        <h1>Subtotal</h1>
                        <h1>₹ {cartTotal?.toLocaleString()}</h1>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <h1>Shipping</h1>
                        <h1>₹ 0.0</h1>
                    </div>
                    <br />
                    <hr className="dark:border-neutral-700" />
                    <br />
                    <div className="flex items-center justify-between py-2 font-semibold uppercase">
                        <h1>Total</h1>
                        <h1>₹ {cartTotal?.toLocaleString()}</h1>
                    </div>
                    <button onClick={() => { router.push('/cart/checkout') }} className="py-2 my-2 bg-green-500 hover:bg-green-500/80 text-white w-full rounded-lg">
                        Checkout
                    </button>
                </div>
            </div>
        </section >
    );
};

export default Cart;
