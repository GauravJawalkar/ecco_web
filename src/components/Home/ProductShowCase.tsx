"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductShowcaseSkeleton from "../Skeletons/Products/ProductShowcaseSkeleton";

interface dataProps {
  _id: string,
  prodImages: [string, string, string],
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
      <div className="grid grid-cols-2 gap-10">
        <div className="h-auto p-5 border dark:border-neutral-700 dark:bg-neutral-950/20 rounded-xl">
          {isLoading && <ProductShowcaseSkeleton />}
          <div className="grid grid-cols-2 gap-5">
            {(!isLoading && firstTwoProducts.length === 0) && <div className="flex items-center justify-center">
              <h1>No Products Here</h1></div>}
            {isError && <div className="flex items-center justify-center">
              <h1>Something Went Wrong</h1></div>}
            {
              firstTwoProducts.length !== 0 && firstTwoProducts.map(({ _id, prodImages, sellerName, prodName, productId }: dataProps) => {
                return (
                  <Link href={`/products/${slugify(prodName)}?id=${productId}`} key={_id} className="relative border dark:border-neutral-700 rounded-3xl">
                    <Image
                      src={prodImages[0]}
                      alt="splImage"
                      height={200} width={200}
                      className="object-contain w-full h-64" />
                    <div className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-b-3xl">
                      <h1 className="capitalize font-semibold text-lg text-center my-1.5 line-clamp-1">{prodName}</h1>
                      <h1 className="text-base text-center text-gray-400 capitalize">Seller : {sellerName}</h1>
                    </div>
                    <div className="absolute top-0 right-0 px-2 text-white bg-green-600 rounded-tr-xl rounded-bl-xl">
                      Today's Special
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
        <div className="h-auto p-5 border dark:border-neutral-700 dark:bg-neutral-950/20 rounded-xl">
          {isLoading && <ProductShowcaseSkeleton />}
          <div className="grid grid-cols-2 gap-5">
            {(!isLoading && lastTwoProducts.length === 0) && <div className="flex items-center justify-center">
              <h1>No Products Here</h1></div>}
            {isError && <div className="flex items-center justify-center">
              <h1>Something Went Wrong</h1></div>}
            {
              lastTwoProducts.length !== 0 && lastTwoProducts.map(({ _id, prodImages, sellerName, prodName, productId }: dataProps) => {
                return (
                  <Link href={`/products/${slugify(prodName)}?id=${productId}`} key={_id} className="relative border dark:border-neutral-700 rounded-3xl">
                    <Image
                      src={prodImages?.[2]}
                      alt="splImage"
                      height={200} width={200}
                      className="object-contain w-full h-64" />
                    <div className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-b-3xl">
                      <h1 className="capitalize font-semibold text-lg text-center my-1.5 line-clamp-1">{prodName}</h1>
                      <h1 className="text-base text-center text-gray-400 capitalize">Seller : {sellerName}</h1>
                    </div>
                    <div className="absolute top-0 right-0 px-2 text-white bg-green-600 rounded-tr-xl rounded-bl-xl">
                      Today's Special
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
