"use client"

import HomeHero from "@/components/Home/HomeHero";
import ProductHolder from "@/components/Home/ProductHolder";
import ProductShowCase from "@/components/Home/ProductShowCase";
import RecommendedProducts from "@/components/Home/RecommendedProducts";
import { useQuery } from "@tanstack/react-query";
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
        return response.data.data
      } else {
        toast.error("Failed to Fetch the Products")
      }

    } catch (error) {
      toast.error("Failed to Fetch the Products")
      console.log("Error fetching the products ", error)
    }
  }

  const { data: myData } = useQuery({ queryKey: ["myData"], queryFn: getProducts })

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div className="h-full">
      <HomeHero />
      <ProductHolder rank={1} data={myData} />
      <ProductHolder rank={2} data={myData?.filter((product: any) => product.price > 600)} />
      <ProductShowCase />
      {myData?.map((prod: any, index: number | null | undefined) => {
        return (
          <h1 key={index}>{prod.name}</h1>
        )
      })}
      <RecommendedProducts />
    </div>
  );
}
