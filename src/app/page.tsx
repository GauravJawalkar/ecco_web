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
      return []
    } catch (error) {
      console.log("Error fetching the products ", error)
      return []
    }
  }

  const { data: myData = [], isLoading } = useQuery({
    queryKey: ["myData"], queryFn: getProducts, refetchOnWindowFocus: false
  })

  useEffect(() => {
    async function checkVaildCookies() {
      try {
        const response = await axios.get('api/sessionCookies');

        if (!response.data.user) {
          localStorage.clear();
        }

      } catch (error) {
        console.log("Error clearing the localStorage", error)
      }
    }

    checkVaildCookies();
  }, [])


  return (
    <div className="h-full">
      <HomeHero />
      <div className="py-10">

        <ProductHolder rank={1} data={myData?.filter((product: any) => product.price >= 600)} loading={isLoading} />
      </div>
      <div className="py-20">
        <ProductHolder rank={2} data={myData?.filter((product: any) => product.price <= 600)} loading={isLoading} />
      </div>
      <div className="py-20">
        <ProductShowCase />
      </div>

      <RecommendedProducts />
    </div>
  );
}
