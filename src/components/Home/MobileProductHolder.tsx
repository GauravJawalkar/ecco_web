"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/store/UserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { discountPercentage } from "@/helpers/discountPercentage";
import { useRouter } from "next/navigation";
import ApiClient from "@/interceptors/ApiClient";
import { ShoppingBag } from "lucide-react";

interface holderProps {
    _id: string;
    name: string;
    price: number;
    images: ["", "", ""];
    discount: number;
    seller: string;
    stock: number;
    rating: [];
    category: string;
}

/* ─── Skeleton ─────────────────────────────────────────────── */
const MobileProductHolderSkeleton = () => (
    <div className="w-full py-5 animate-pulse">
        <div className="flex justify-between items-center px-4 mb-3">
            <div className="h-4 w-24 bg-gray-100 dark:bg-neutral-800 rounded-full" />
            <div className="h-3 w-12 bg-gray-100 dark:bg-neutral-800 rounded-full" />
        </div>
        <div className="mx-4 mb-4 h-24 bg-gray-100 dark:bg-neutral-800 rounded-2xl" />
        <div className="flex gap-2.5 px-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="flex-shrink-0 w-[140px] h-[220px] bg-gray-100 dark:bg-neutral-800 rounded-[18px]"
                    style={{ opacity: 1 - i * 0.25 }}
                />
            ))}
        </div>
    </div>
);

/* ─── Main Component ────────────────────────────────────────── */
const MobileProductHolder = ({
    prodData,
    loading,
    tag,
    adImage,
}: {
    prodData: any;
    loading: boolean;
    tag: string;
    adImage: string;
}) => {
    const slugify = (name: string) =>
        name.toLowerCase().replace(/\s+/g, "-");

    const { data }: any = useUserStore();
    const cartOwnerId = data?._id;
    const queryClient = useQueryClient();
    const router = useRouter();

    const addToCartMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await ApiClient.post("/api/addToCart", payload);
            if (response.data.data) return response.data.data;
            throw new Error("Failed to add to cart");
        },
        onSuccess: () => {
            toast.success("Added to cart");
            queryClient.invalidateQueries({ queryKey: ["userCart", cartOwnerId] });
        },
        onError: (error: any) => {
            if (
                error.response?.data?.error === "Unauthorized Access" ||
                error.response?.status === 401
            ) {
                toast.error("Please sign in");
                router.push("/login");
            } else {
                toast.error("Couldn't add to cart");
            }
        },
    });

    const handleCart = (e: React.MouseEvent, product: holderProps) => {
        e.preventDefault();
        e.stopPropagation();
        addToCartMutation.mutate({
            cartOwner: cartOwnerId,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            discount: product.discount,
            stock: product.stock,
            productId: product._id,
            sellerId: product.seller,
        });
    };

    if (loading) return <MobileProductHolderSkeleton />;

    return (
        <section className="w-full py-5 bg-white dark:bg-[#1a1a1a]">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 mb-3.5">
                <h2 className="text-[15px] font-medium tracking-tight text-gray-900 dark:text-gray-50">
                    {tag}
                </h2>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-[11px] tracking-wide text-gray-400 dark:text-neutral-500 active:opacity-60 transition-opacity border border-gray-100 dark:border-neutral-800 py-1 px-2 rounded-full">
                    See all
                    <svg
                        width="10" height="10" viewBox="0 0 10 10"
                        fill="none" stroke="currentColor" strokeWidth="1.5"
                        className="opacity-60">
                        <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" />
                    </svg>
                </Link>
            </div>

            {/* ── Ad Banner ── */}
            {adImage && (
                <div className="mx-4 mb-4">
                    <div className="relative w-full h-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-neutral-900">
                        <Image
                            src={adImage}
                            alt="Featured offer"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) calc(100vw - 32px)"
                            priority />
                    </div>
                </div>
            )}

            {/* ── Product Rail ── */}
            <div className="flex gap-2.5 px-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5">
                {prodData?.map((product: holderProps, idx: number) => {
                    const savedPct = Math.round(
                        discountPercentage(product.price, product.discount)
                    );
                    const finalPrice = (product.price - product.discount).toLocaleString("en-IN");
                    const origPrice = product.price.toLocaleString("en-IN");

                    return (
                        <Link
                            key={product._id}
                            href={`/products/${slugify(product.name)}?id=${product._id}`}
                            className=" snap-start flex-shrink-0 w-[140px] flex flex-col rounded-lg overflow-hidden bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 active:scale-[0.96] transition-transform duration-150 touch-manipulation"
                            style={{
                                animationName: "prodFadeUp",
                                animationDuration: "280ms",
                                animationTimingFunction: "ease-out",
                                animationFillMode: "both",
                                animationDelay: `${idx * 45}ms`,
                            }}>
                            {/* Image */}
                            <div className="relative w-full aspect-square bg-white dark:bg-neutral-800 flex items-center justify-center p-3">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={product.images?.[0] || ""}
                                        alt={product.name}
                                        fill
                                        className="object-contain mix-blend-multiply dark:mix-blend-normal"
                                        sizes="140px"
                                    />
                                </div>
                                {savedPct > 0 && (
                                    <span className="absolute top-2 left-2 text-[9px] font-medium leading-none tracking-wide bg-green-600 text-white px-2 py-1 rounded-full">
                                        {savedPct}% off
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col flex-1 px-2.5 pt-2 pb-2.5 gap-2">
                                <p className="text-[11px] leading-[1.45] text-gray-500 dark:text-neutral-400 line-clamp-2 flex-1 capitalize">
                                    {product.name}
                                </p>

                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] font-medium text-gray-900 dark:text-gray-50 leading-none">
                                            ₹{finalPrice}
                                        </span>
                                        <span className="text-[10px] text-gray-300 dark:text-neutral-600 line-through leading-none">
                                            ₹{origPrice}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        aria-label="Add to cart"
                                        onClick={(e) => handleCart(e, product)}
                                        disabled={addToCartMutation.isPending}
                                        className=" w-[30px] h-[30px] flex-shrink-0 flex items-center justify-center rounded-full border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 active:scale-90 active:bg-gray-50 dark:active:bg-neutral-700 transition-all duration-100 disabled:opacity-40">
                                        <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.6} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* iOS Safari trailing space */}
                <div className="w-2 flex-shrink-0" aria-hidden="true" />
            </div>

            <style>{`
        @keyframes prodFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};

export default MobileProductHolder;