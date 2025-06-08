"use client"

import { useMutation } from "@tanstack/react-query";
import axios from "axios"
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const RecentlyViewedProducts = ({ products }: { products: [string] }) => {

    async function getRecentProducts() {
        try {
            const response = await axios.post('/api/recentProducts', { products });
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Failed to fetch the recent Products");
            return [];
        }
    }

    const mutation = useMutation({
        mutationFn: getRecentProducts,
        onError: (error) => {
            console.error('Failed to fetch : ', error);
        }
    })

    useEffect(() => {
        mutation.mutate();
    }, [products]);
    const slugify = (prodName: string) => prodName.toLowerCase().replace(/\s+/g, '-');


    return (
        <div className=" border h-auto dark:border-neutral-500 pb-4 rounded-xl">
            <div className="flex items-center justify-start gap-3">
                <div className="h-auto p-5 dark:bg-neutral-950/20  rounded-xl">
                    <div className="gap-5 grid grid-cols-5">
                        {
                            mutation?.data?.length !== 0 && mutation?.data?.map(({ _id, images, name, price, discount }: { _id: string, images: [string], name: string, price: number, discount: number }) => {
                                return (
                                    <Link href={`/products/${slugify(name)}?id=${_id}`} key={_id} className="border dark:border-neutral-700 rounded-3xl relative">
                                        <Image
                                            src={images?.[0] || ""}
                                            alt="recentViewImage"
                                            height={200} width={200}
                                            className="w-full h-64 object-contain p-2 dark:bg-neutral-800 rounded-tr-3xl rounded-tl-3xl" />
                                        <div className=" border-t dark:border-t-neutral-700 rounded-b-3xl p-2">
                                            <h1 className="capitalize font-normal text-center text-lg my-1.5 line-clamp-1">{name}</h1>
                                            <h1 className="capitalize font-semibold text-lg text-center my-1.5 line-clamp-1 ">
                                                ₹{price - discount}
                                                <span className="line-through text-gray-500 font-normal text-base px-2">
                                                    {price}
                                                </span>
                                            </h1>
                                        </div>
                                        <div className="absolute top-0 right-0 px-2 bg-green-600 text-white rounded-tr-xl rounded-bl-xl">
                                            Recent View
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecentlyViewedProducts