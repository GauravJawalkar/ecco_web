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

  const { data: specialProducts = [], isLoading, isError, } = useQuery({
    queryFn: getSpecialShowCaseProducts,
    queryKey: ["specialProducts"],
    refetchOnWindowFocus: false,
  });

  const firstTwoProducts = specialProducts?.slice(0, 2);
  const lastTwoProducts = specialProducts?.slice(2, 4);
  const slugify = (prodName: string) =>
    prodName.toLowerCase().replace(/\s+/g, "-");

  const ProductCard = ({ prodImages, sellerName, prodName, productId, _id }: dataProps) => (
    <Link
      href={`/products/${slugify(prodName)}?id=${productId}`}
      key={_id}
      className="relative border dark:border-neutral-700 rounded-2xl lg:rounded-xl touch-manipulation group flex flex-col h-full overflow-hidden active:scale-[0.97] lg:active:scale-100 transition-transform duration-150">
      {/* Image */}
      <div className="w-full relative bg-white dark:bg-transparent aspect-square lg:aspect-auto lg:h-64">
        <Image
          src={prodImages?.[0]}
          alt={prodName}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
          className="object-contain p-3 sm:p-4 lg:p-0 transition-transform duration-300 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      {/* Info */}
      <div className="p-2 sm:p-3 lg:p-4 bg-gray-100 dark:bg-neutral-800 rounded-b-2xl lg:rounded-b-xl shrink-0 mt-auto">
        <h1 className="capitalize font-medium sm:font-semibold text-xs sm:text-sm lg:text-lg text-center my-1 lg:my-1.5 line-clamp-1">
          {prodName}
        </h1>
        <h1 className="text-[10px] sm:text-xs lg:text-base text-center text-gray-500 dark:text-gray-400 capitalize truncate">
          Seller: {sellerName}
        </h1>
      </div>

      {/* Badge — pill on mobile/tablet, original green tab on desktop */}
      <span className=" absolute z-10 lg:top-0 lg:right-0 lg:left-auto lg:bottom-auto lg:px-4 lg:py-0.5 lg:rounded-tr-lg lg:rounded-bl-xl lg:rounded-tl-none lg:rounded-br-none lg:bg-green-600 lg:text-white lg:text-sm lg:font-normal lg:tracking-normal top-2 left-2 px-2 py-1 rounded-xl bg-green-600 dark:bg-green-600 text-white dark:text-white text-[9px] font-medium leading-none tracking-wide">
        Today's Special
      </span>
    </Link>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">

        {/* Panel 1 */}
        <div className="h-auto p-0 sm:p-4 lg:p-5 md:border dark:border-neutral-700 dark:bg-neutral-950/20 rounded-lg relative">
          {isLoading && <ProductShowcaseSkeleton />}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {!isLoading && firstTwoProducts.length === 0 && (
              <div className="flex items-center justify-center col-span-2 py-10">
                <p className="text-sm">No Products Here</p>
              </div>
            )}
            {isError && (
              <div className="flex items-center justify-center col-span-2 py-10">
                <p className="text-sm">Something Went Wrong</p>
              </div>
            )}
            {firstTwoProducts.length !== 0 &&
              firstTwoProducts.map((product: dataProps) => (
                <ProductCard key={product._id} {...product} />
              ))}
          </div>
        </div>

        {/* Panel 2 */}
        <div className="h-auto p-0 sm:p-4 lg:p-5 md:border dark:border-neutral-700 dark:bg-neutral-950/20 rounded-lg relative">
          {isLoading && <ProductShowcaseSkeleton />}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {!isLoading && lastTwoProducts.length === 0 && (
              <div className="flex items-center justify-center col-span-2 py-10">
                <p className="text-sm">No Products Here</p>
              </div>
            )}
            {isError && (
              <div className="flex items-center justify-center col-span-2 py-10">
                <p className="text-sm">Something Went Wrong</p>
              </div>
            )}
            {lastTwoProducts.length !== 0 &&
              lastTwoProducts.map((product: dataProps) => (
                <ProductCard key={product._id} {...product} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowCase;