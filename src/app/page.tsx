"use client"

import HomeFilter from "@/components/Filters/HomeFilter";
import HomeHero from "@/components/Home/HomeHero";
import ProductHolder from "@/components/Home/ProductHolder";
import ProductShowCase from "@/components/Home/ProductShowCase";
import RecentlyViewedProducts from "@/components/Home/RecommendedProducts";
import { useUserStore } from "@/store/UserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const { data }: any = useUserStore();
  const [recentlyViewed, setRecentlyViewed] = useState<any>({});

  async function getProducts() {
    try {
      const response = await axios.get('../api/getProducts');
      if (response.data.data) {
        return response.data.data
      } else {
        toast.error("Failed to Fetch the Products")
      }
      return [];
    } catch (error) {
      console.error("Error getting the products ", error)
      return []
    }
  }

  const { data: myData = [], isLoading, isFetched, isSuccess } = useQuery({
    queryKey: ["myData"], queryFn: getProducts, refetchOnWindowFocus: false
  })

  let existingRecentlyViewed;

  if (isFetched && isSuccess) {
    existingRecentlyViewed = JSON.parse(localStorage.getItem(`${'RecentView' + data?._id}`) || "{}");
  }


  useEffect(() => {
    async function checkVaildCookies() {
      try {
        const response = await axios.get('/api/sessionCookies');
        if (response.data?.user !== "" || response.data?.user.trim() !== "") {
          return response.data.user
        } else {
          localStorage.removeItem('userLogin');
          toast.success("clearing the localstorage")
        }
      } catch (error) {
        console.error("Error clearing the localStorage", error)
      }
    }
    checkVaildCookies();
  }, [])


  return (
    <div>
      <HomeHero />
      <div className="pt-10">
        <HomeFilter />
      </div>
      <div className="py-10 mb-10">
        <ProductHolder rank={1} prodData={myData?.filter((product: any) => product.price >= 600)} loading={isLoading} />
      </div>
      <div className="py-20 mb-10">
        <ProductHolder rank={2} prodData={myData?.filter((product: any) => product.price <= 600)} loading={isLoading} />
      </div>
      <div className="py-20">
        <ProductShowCase />
      </div>

      {(existingRecentlyViewed?.product?.length > 0 && existingRecentlyViewed?.user === data?._id) &&
        <RecentlyViewedProducts products={existingRecentlyViewed?.product} />}
    </div>
  );
}
