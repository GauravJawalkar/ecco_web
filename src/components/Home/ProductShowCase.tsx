"use cliet";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface dataProps {
  _id: string,
  prodImages: [string],
  sellerName: string,
  prodName: string

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


  return (
    <div className="my-10">

      <div className="flex items-center justify-center py-10">
        <h1 className="text-3xl font-bold"> Today's Special Appearence</h1>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="h-auto border p-5">
          <div className="grid grid-cols-2 gap-5">
            {isLoading && <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" /></div>}
            {(!isLoading && firstTwoProducts.length === 0) && <div className="flex items-center justify-center">
              <h1>No Products Here</h1></div>}
            {isError && <div className="flex items-center justify-center">
              <h1>Something Went Wrong</h1></div>}
            {
              firstTwoProducts.length !== 0 && firstTwoProducts.map(({ _id, prodImages, sellerName, prodName }: dataProps) => {
                return (
                  <div key={_id} className="border p-4">
                    <Image
                      src={prodImages[0]}
                      alt="splImage"
                      height={200} width={200}
                      className="w-full h-64 object-cover" />
                    <h1 className="capitalize font-semibold text-lg py-2 line-clamp-1">{prodName}</h1>
                    <h1 className="capitalize text-base text-gray-500">Seller : {sellerName}</h1>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="h-auto border p-5">
          <div className="grid grid-cols-2 gap-5">
            {isLoading && <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" /></div>}
            {(!isLoading && lastTwoProducts.length === 0) && <div className="flex items-center justify-center">
              <h1>No Products Here</h1></div>}
            {isError && <div className="flex items-center justify-center">
              <h1>Something Went Wrong</h1></div>}
            {
              lastTwoProducts.length !== 0 && lastTwoProducts.map(({ _id, prodImages, sellerName, prodName }: dataProps) => {
                return (
                  <div key={_id} className="border p-4">
                    <Image
                      src={prodImages[0]}
                      alt="splImage"
                      height={200} width={200}
                      className="w-full h-64 object-cover" />
                    <h1 className="capitalize font-semibold text-lg py-2 line-clamp-1">{prodName}</h1>
                    <h1 className="capitalize text-base text-gray-500">Seller : {sellerName}</h1>
                  </div>
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
