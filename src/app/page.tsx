"use client"

import HomeHero from "@/components/Home/HomeHero";
import ProductHolder from "@/components/Home/ProductHolder";
import ProductShowCase from "@/components/Home/ProductShowCase";
import RecommendedProducts from "@/components/Home/RecommendedProducts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Home() {

  async function getProducts() {
    try {
      const response = await axios.get('../api/getProducts');

      if (response.data.data) {
        return response.data.data
      } else {
        toast.error("Failed to Fetch the Products")
      }

    } catch (error) {
      console.log("Error fetching the products ", error)
    }
  }

  const { data: myData = [] } = useQuery({
    queryKey: ["myData"], queryFn: getProducts, refetchOnWindowFocus: false
  })


  return (
    <div className="h-full">
      <HomeHero />
      <ProductHolder rank={1} data={myData?.filter((product: any) => product.price >= 600)} />
      <ProductHolder rank={2} data={myData?.filter((product: any) => product.price <= 600)} />
      <ProductShowCase />
      <RecommendedProducts />
    </div>
  );
}
