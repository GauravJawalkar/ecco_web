"use cliet";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface dataProps {
  _id: string,
  prodImages: [string],
  sellerName: string,
  prodName: string

}

const ProductShowCase = () => {
  const [data, setData] = useState([]);

  async function getSpecialShowCaseProducts() {
    try {
      const response = await axios.get('../api/getSplProducts');

      if (response.data.data) {
        setData(response.data.data)
        toast.success("Special Products are here")
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch the special products")
    }
  }

  const firstTwoProducts = data.slice(0, 2);
  const lastTwoProducts = data.slice(2, 4);

  useEffect(() => {
    getSpecialShowCaseProducts()
  }, [])

  return (
    <div className="my-10">
      <div className="grid grid-cols-2 gap-10">
        <div className="h-auto border p-5">
          <div className="grid grid-cols-2 gap-5">
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
