"use client";

import Loader from "@/components/Loaders/Loader";
import { useUserStore } from "@/store/UserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
    const [quantityOperation, setQuantityOperation] = useState("");
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(false);

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

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Create Razorpay order
            const { data: order } = await axios.post('/api/razorpay/order', {
                amount: cartTotal,
                receipt: 'receipt_001',
            });

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: 'Your Store',
                description: 'Test Transaction',
                order_id: order.id,
                handler: async function (response: any) {
                    // Verify payment signature
                    const { data: verifyData } = await axios.post('/api/razorpay/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verifyData.success) {
                        toast.success('✅ Payment successful and verified!');
                    } else {
                        toast.error('❌ Payment verification failed.');
                    }
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razor = new (window as any).Razorpay(options);
            razor.open();
        } catch (err) {
            console.error('Error in Razorpay flow:', err);
            toast.error('Payment failed to initiate.');
        }

        setLoading(false);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

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
        <section className="h-auto">
            {userCart?.cartItems?.length > 0 ? (
                <div className="text-2xl font-semibold text-center uppercase py-10">
                    My Shopping Cart
                </div>
            ) : (
                <div className="text-2xl font-semibold uppercase text-center py-10">
                    Your Cart Is Empty
                </div>
            )}
            <div className="grid grid-cols-[3fr_1fr] gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {userCart?.cartItems?.length > 0 &&
                        userCart?.cartItems?.map(
                            ({ name, price, image, quantity, discount, sellerName, _id }: cartMappingProps) => {
                                return (
                                    <div className="p-5 border rounded dark:border-neutral-700 gap-3 my-3 relative h-fit" key={name + price}>
                                        <div>
                                            <div className="flex gap-3">
                                                <Image
                                                    width={200}
                                                    height={200}
                                                    src={image || "/userProfile.png"}
                                                    alt={"cartImage"}
                                                    className="h-auto w-28 rounded border-2 object-cover"
                                                />
                                                <div className="flex items-start justify-start flex-col">
                                                    <h1 className="capitalize text-xl font-semibold line-clamp-1" title={name}>{name}</h1>
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
                                                            handelAddItemQuantity(_id, quantity);
                                                        }} className="p-1 border-2 rounded-full dark:border-neutral-700">
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                        <h1 className="text-sm py-1 px-2 dark:border-neutral-700 rounded border">{quantity}</h1>
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            setQuantityOperation("-");
                                                            handelAddItemQuantity(_id, quantity);
                                                        }} className="p-1 border-2 rounded-full dark:border-neutral-700">
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <button onClick={(e) => { e.preventDefault(); handelRemoveItem(_id) }} className="text-sm">REMOVE ITEM</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-[#1a1a1a] rounded-full absolute -top-3 -right-2">
                                            <h1 className="py-[2px] px-2 border text-green-500 border-green-500">In Stock</h1>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                </div>
                <div className={` ${userCart?.cartItems?.length <= 0 ? "hidden" : " w-full p-5 border rounded my-3  dark:border-neutral-700 h-fit sticky top-24"}`}>
                    <h1 className="font-semibold uppercase text-lg">
                        CART Summary :
                    </h1>

                    <div className="pt-10 flex items-center justify-between">
                        <h1>Subtotal</h1>
                        <h1>₹ {cartTotal}</h1>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                        <h1>Shipping</h1>
                        <h1>₹ 0.0</h1>
                    </div>
                    <br />
                    <hr />
                    <br />
                    <div className="py-2 flex items-center justify-between font-semibold uppercase">
                        <h1>Total</h1>
                        <h1>₹ {cartTotal}</h1>
                    </div>
                    <div className="py-4">
                        <button type="button" onClick={handlePayment} className="w-full bg-green-500 py-2 rounded dark:text-black text-white">
                            {loading ? <Loader title="Processing..." /> : 'Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Cart;
