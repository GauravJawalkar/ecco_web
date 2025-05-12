"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface dataProps {
  _id: string,
  prodImages: [string],
  sellerName: string,
  prodName: string,
  productId: string
}

const ProductShowCase = () => {

  async function getSpecialShowCaseProducts() {
    try {
      const response = await axios.get('../api/getSplProducts');

      if (response.data.data) {
        return response.data.data
      } else {
        console.log("Failed to get special products");
      }

      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: specialProducts = [], isLoading, isError } = useQuery({ queryFn: getSpecialShowCaseProducts, queryKey: ['specialProducts'], refetchOnWindowFocus: false })

  const firstTwoProducts = specialProducts?.slice(0, 2);
  const lastTwoProducts = specialProducts?.slice(2, 4);
  const slugify = (prodName: string) => prodName.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>

      <div className="flex items-center justify-center pb-10">
        <h1 className="text-3xl font-bold"> Today's Special Appearence</h1>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="h-auto border p-5 dark:border-neutral-700 dark:bg-neutral-950/20  rounded-xl">
          <div className="grid grid-cols-2 gap-5">
            {isLoading && <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" /></div>}
            {(!isLoading && firstTwoProducts.length === 0) && <div className="flex items-center justify-center">
              <h1>No Products Here</h1></div>}
            {isError && <div className="flex items-center justify-center">
              <h1>Something Went Wrong</h1></div>}
            {
              firstTwoProducts.length !== 0 && firstTwoProducts.map(({ _id, prodImages, sellerName, prodName, productId }: dataProps) => {
                return (
                  <Link href={`/products/${slugify(prodName)}?id=${productId}`} key={_id} className="border dark:border-neutral-700  rounded-3xl">
                    <Image
                      src={prodImages[0]}
                      alt="splImage"
                      height={200} width={200}
                      className="w-full h-64 object-contain" />
                    <div className="dark:bg-neutral-800 bg-gray-100 rounded-b-3xl p-4">
                      <h1 className="capitalize font-semibold text-lg my-1.5 line-clamp-1">{prodName}</h1>
                      <h1 className="capitalize text-base text-gray-400">Seller : {sellerName}</h1>
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
        <div className="h-auto border p-5 dark:border-neutral-700 dark:bg-neutral-950/20 rounded-xl">
          <div className="grid grid-cols-2 gap-5">
            {isLoading && <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" /></div>}
            {(!isLoading && lastTwoProducts.length === 0) && <div className="flex items-center justify-center">
              <h1>No Products Here</h1></div>}
            {isError && <div className="flex items-center justify-center">
              <h1>Something Went Wrong</h1></div>}
            {
              lastTwoProducts.length !== 0 && lastTwoProducts.map(({ _id, prodImages, sellerName, prodName, productId }: dataProps) => {
                return (
                  <Link href={`/products/${slugify(prodName)}?id=${productId}`} key={_id} className="border dark:border-neutral-700  rounded-3xl">
                    <Image
                      src={prodImages[0]}
                      alt="splImage"
                      height={200} width={200}
                      className="w-full h-64 object-contain" />
                    <div className="dark:bg-neutral-800 bg-gray-100 rounded-b-3xl p-4">
                      <h1 className="capitalize font-semibold text-lg my-1.5 line-clamp-1">{prodName}</h1>
                      <h1 className="capitalize text-base text-gray-400">Seller : {sellerName}</h1>
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowCase;
