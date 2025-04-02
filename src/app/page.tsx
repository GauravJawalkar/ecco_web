"use client"

import HomeHero from "@/components/Home/HomeHero";
import ProductHolder from "@/components/Home/ProductHolder";
import ProductShowCase from "@/components/Home/ProductShowCase";
import RecommendedProducts from "@/components/Home/RecommendedProducts";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {

  const [holderDataOne, setHolderDataOne] = useState([]);
  const [holderDataTwo, setHolderDataTwo] = useState([])

  async function getProducts() {
    try {
      const response = await axios.get('../api/getProducts');

      if (response.data.data) {
        toast.success("Products Fetched Successfully")
        setHolderDataOne(response.data.data.filter((product: any) => product?.price > 200))
        setHolderDataTwo(response.data.data.filter((product: any) => product?.price > 500))
      } else {
        toast.error("Failed to Fetch the Products")
      }

    } catch (error) {
      toast.error("Failed to Fetch the Products")
      console.log("Error fetching the products ", error)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div className="h-full">
      <HomeHero />
      {holderDataOne.length !== 0 && <ProductHolder rank={1} data={holderDataOne} />}
      {holderDataTwo.length !== 0 && <ProductHolder rank={2} data={holderDataTwo} />}
      <ProductShowCase />
      <RecommendedProducts />
    </div>
  );
}
