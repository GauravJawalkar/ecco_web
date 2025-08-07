"use client";

import { userProps } from "@/interfaces/commonInterfaces";
import { useUserStore } from "@/store/UserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Lock, MessageSquare, Minus, PackageOpen, Plus, ShoppingBag, ShoppingCart, Trash2, Truck } from "lucide-react";
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
    const { data }: { data: userProps } = useUserStore();
    const cartOwnerId = data?._id;
    const queryClient = useQueryClient();
    const [quantityOperation, setQuantityOperation] = useState("");
    const [cartTotal, setCartTotal] = useState(0);
    const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
    const router = useRouter();

    async function getCartItems() {
        try {
            const response = await axios.get(`../../api/getCart/${cartOwnerId}`);
            if (response.data?.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error getting the cart details :", error);
            return [];
        }
    }

    const { data: userCart = [], isLoading, isError, isPending } = useQuery({
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

    return (
        <section className="my-10">
            {((!isPending && !isError) && userCart?.length === 0 || userCart?.cartItems?.length === 0) && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl dark:border-neutral-700">
                    <PackageOpen className="w-16 h-16 text-gray-400 dark:text-neutral-500" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Your Cart Is Empty</h3>
                    <p className="max-w-md mt-2 text-center text-gray-600 dark:text-neutral-400">
                        Looks like you haven't added anything to your cart yet
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center px-6 py-2 mt-5 transition-colors text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 gap-3"
                    >
                        <ArrowLeft className="h-5 w-5" />  Continue Shopping
                    </Link>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">

                {/* Order Summary Sidebar - Only shows when cart has items */}
                {userCart?.cartItems?.length > 0 && (
                    <div className="sticky top-24 h-fit">
                        <div className="p-6 border rounded-xl dark:border-neutral-700 dark:bg-neutral-800/50">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Order Summary</h2>

                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-neutral-300">Subtotal</span>
                                    <span className="font-medium">₹{cartTotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-neutral-300">Shipping</span>
                                    <span className="text-green-600 dark:text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t dark:border-neutral-700">
                                    <span className="text-gray-600 dark:text-neutral-300">Taxes</span>
                                    <span>₹0.00</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4 mt-6 border-t dark:border-neutral-700">
                                <span className="font-bold text-gray-800 dark:text-white">Total</span>
                                <span className="text-lg font-bold">₹{cartTotal?.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={() => router.push('/cart/checkout')}
                                className="w-full py-2 mt-3 text-sm font-medium text-white transition-colors rounded-lg shadow-sm bg-green-600/90 hover:bg-green-700 hover:shadow-md"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-neutral-400">
                                <Lock className="w-4 h-4 mr-2" />
                                Secure checkout
                            </div>
                        </div>

                        <div className="p-6 mt-4 border rounded-xl dark:border-neutral-700 dark:bg-neutral-800/50">
                            <h3 className="font-medium text-gray-800 dark:text-white">Need help?</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">
                                Contact our customer support for assistance with your order.
                            </p>
                            <button className="flex items-center gap-2 mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                <MessageSquare className="w-4 h-4" />
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Cart;
