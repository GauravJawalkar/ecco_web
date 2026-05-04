"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import ProductShowcaseSkeleton from "../Skeletons/Products/ProductShowcaseSkeleton";
import ApiClient from "@/interceptors/ApiClient";

interface dataProps {
  _id: string;
  prodImages: [string, string, string];
  sellerName: string;
  prodName: string;
  productId: string;
}

const ProductShowCase = () => {
  async function getSpecialShowCaseProducts() {
    try {
      const response = await ApiClient.get("/api/getSplProducts");
      if (response.data.data) return response.data.data;
      return [];
    } catch {
      return [];
    }
  }

  const {
    data: specialProducts = [],
    isLoading,
    isError,
  } = useQuery({
    queryFn: getSpecialShowCaseProducts,
    queryKey: ["specialProducts"],
    refetchOnWindowFocus: false,
  });

  const slugify = (prodName: string) =>
    prodName.toLowerCase().replace(/\s+/g, "-");

  if (isLoading) return <ProductShowcaseSkeleton />;

  if (isError)
    return (
      <div className="flex items-center justify-center py-10 px-4">
        <p className="text-sm text-gray-400 dark:text-neutral-500">
          Something went wrong
        </p>
      </div>
    );

  if (specialProducts.length === 0)
    return (
      <div className="flex items-center justify-center py-10 px-4">
        <p className="text-sm text-gray-400 dark:text-neutral-500">
          No products here
        </p>
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      {/* 
        Mobile:  2-col grid, all 4 cards in one row-wrapped grid
        Desktop: 2 side-by-side panels each holding 2 cards
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {specialProducts.slice(0, 4).map(
          ({ _id, prodImages, sellerName, prodName, productId }: dataProps) => (
            <Link
              href={`/products/${slugify(prodName)}?id=${productId}`}
              key={_id}
              className=" relative flex flex-col border border-gray-100 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950 touch-manipulation group active:scale-[0.97] transition-transform duration-150">
              {/* Image */}
              <div className="relative w-full aspect-square bg-white dark:bg-neutral-900 flex items-center justify-center">
                <Image
                  src={prodImages?.[0]}
                  alt={prodName}
                  width={500}
                  height={500}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-contain h-[150px] w-[150px] p-3 sm:p-4 transition-transform duration-300 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
                />
                {/* Badge */}
                <span className=" absolute top-2 left-2 text-[9px] font-medium leading-none tracking-wide bg-green-600 dark:bg-green-300 text-white dark:text-green-600 px-2 py-1 rounded-full z-10">
                  Today's Special
                </span>
              </div>

              {/* Info */}
              <div className="px-2.5 py-2 sm:p-3 bg-gray-50 dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800">
                <p className=" capitalize text-center font-medium text-[11px] sm:text-xs lg:text-sm text-gray-900 dark:text-gray-100 line-clamp-1 mb-0.5">
                  {prodName}
                </p>
                <p className=" text-center text-[9px] sm:text-[10px] lg:text-xs text-gray-400 dark:text-neutral-500 capitalize truncate">
                  {sellerName}
                </p>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default ProductShowCase;