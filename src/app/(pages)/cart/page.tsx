"use client";

import ApiClient from "@/interceptors/ApiClient";
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
            const response = await ApiClient.get(`../../api/getCart/${cartOwnerId}`);
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
            const response = await ApiClient.put('/api/removeCartItem',
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
            const response = await ApiClient.put('api/updateCart', { data: { _id, quantityOperation, cartId, quantity } });
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
        <section className="py-10">

            {((!isPending && !isError) && (userCart?.length === 0 || userCart?.cartItems?.length === 0)) && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl dark:border-neutral-700">
                    <PackageOpen className="w-16 h-16 text-gray-400 dark:text-neutral-500" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Your cart feels light</h3>
                    <p className="mt-2 text-gray-600 dark:text-neutral-400 max-w-md text-center">
                        No items added yet. Start shopping to fill your cart with amazing products!
                    </p>
                    <Link
                        href="/products"
                        className="flex items-center gap-2 px-8 py-2 mt-8 text-sm text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-md"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
                {/* Main Cart Content - Expands full width when empty */}
                <div>
                    {/* Cart Items Grid */}
                    {userCart?.cartItems?.length > 0 && (
                        <>
                            <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                                Your Cart ({userCart?.cartItems?.length || 0})
                            </h1>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {userCart.cartItems.map(
                                    ({ name, price, image, quantity, discount, sellerName, _id, stock, productId }: cartMappingProps) => (
                                        <div
                                            key={_id}
                                            className="relative flex flex-col h-full p-4 border rounded-xl dark:border-neutral-700 dark:bg-neutral-800/50 hover:shadow-sm"
                                        >
                                            {/* Product Info - Top Section */}
                                            <Link href={`/products/${slugify(name)}?id=${productId}`} className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        width={120}
                                                        height={120}
                                                        src={image || "/placeholder-product.png"}
                                                        alt={name}
                                                        className="object-cover w-24 h-24 border rounded-lg dark:border-neutral-700"
                                                    />
                                                </div>
                                                <div className="flex-1 min-h-[6rem]"> {/* Fixed height container */}
                                                    <h2 className="w-3/4 font-medium text-gray-800 capitalize line-clamp-2 dark:text-neutral-100" title={name}>
                                                        {name}
                                                    </h2>
                                                    <div className="mt-1 space-y-1 text-sm">
                                                        <p className="text-gray-600 dark:text-neutral-300">
                                                            <span className="font-medium">₹{(price - discount)?.toLocaleString()}</span>
                                                            {discount > 0 && (
                                                                <span className="ml-2 text-xs text-gray-400 line-through">
                                                                    ₹{price?.toLocaleString()}
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-gray-500 dark:text-neutral-400">
                                                            Seller: <span className="capitalize">{sellerName}</span>
                                                        </p>
                                                        <p className="text-green-600 dark:text-green-400">
                                                            <Truck className="inline w-4 h-4 mr-1" />
                                                            Free delivery
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Quantity Controls - Bottom Section */}
                                            <div className="pt-2 mt-auto dark:border-neutral-700">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setQuantityOperation("-");
                                                                handelAddItemQuantity(_id, quantity);
                                                            }}
                                                            disabled={quantity <= 1}
                                                            className="p-1.5 rounded-full border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center">{quantity}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setQuantityOperation("+");
                                                                handelAddItemQuantity(_id, quantity);
                                                            }}
                                                            disabled={quantity >= stock}
                                                            className="p-1.5 rounded-full border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 disabled:opacity-50"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handelRemoveItem(_id);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 transition-colors bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stock Status Badge */}
                                            <div className="absolute top-3 right-3">
                                                {stock >= 10 ? (
                                                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                                        In Stock
                                                    </span>
                                                ) : stock === 0 ? (
                                                    <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                                        Out of Stock
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                        Only {stock} left
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>

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

                            <div className="flex items-center justify-center text-center w-full mt-4 text-sm text-gray-500 dark:text-neutral-400">
                                <Lock className="w-4 h-4 mr-2" />
                                Secure checkout with Razorpay
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
