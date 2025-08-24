"use client"

import HomeFilter from "@/components/Filters/HomeFilter";
import HomeHero from "@/components/Home/HomeHero";
import ProductHolder from "@/components/Home/ProductHolder";
import ProductShowCase from "@/components/Home/ProductShowCase";
import RecentlyViewedProducts from "@/components/Home/RecommendedProducts";
import { useUserStore } from "@/store/UserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface PricingProps {
  price: number;
  discount: number;
}

export default function Home() {
  const { data }: any = useUserStore();
  const [existingRecentlyViewed, setExistingRecentlyViewed] = useState<any | null>({});

  const calculateDiscountedPrice = (a: PricingProps, b: PricingProps) => {
    const priceA = a.price + (a.discount || 0);
    const priceB = b.price + (b.discount || 0);
    const discountPercentA = (a.discount || 0) / priceA * 100;
    const discountPercentB = (b.discount || 0) / priceB * 100;
    return discountPercentB - discountPercentA;
  }

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
    queryKey: ["myData"],
    queryFn: getProducts,
    refetchOnWindowFocus: false
  })

  const getAverageRating = useCallback((product: any): number => {
    if (!product.rating || product.rating.length === 0) return 0;
    const total = product.rating.reduce((sum: number, rate: any) => sum + rate.rateNumber, 0);
    return total / product.rating.length;
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`${'RecentView' + data?._id}`) || "{}");
    if (stored && data?._id) {
      setExistingRecentlyViewed(stored);
    }
  }, [isSuccess, isFetched]);

  const memoizedProducts = useMemo(() => {
    return existingRecentlyViewed?.product || [];
  }, [existingRecentlyViewed?.product]);

  useEffect(() => {
    async function checkVaildCookies() {
      try {
        const response = await axios.get('/api/sessionCookies');
        if (response.data?.user !== "" || response.data?.user.trim() !== "") {
          return response.data.user
        } else {
          localStorage.removeItem('userLogin');
          toast.success("Authorizing...")
        }
      } catch (error: any) {
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
        <ProductHolder
          adImage="/Ads/Ad-1.png"
          rank={1}
          tag="Great Deals"
          prodData={myData?.filter((product: PricingProps) => (product?.price - product?.discount) >= 600)}
          loading={isLoading} />
      </div>
      <div className="py-20 mb-10">
        <ProductHolder
          adImage="/Ads/3971579.jpg"
          rank={2}
          tag="Best Selling"
          prodData={[...(myData || [])].sort((a: PricingProps, b: PricingProps) => calculateDiscountedPrice(a, b))}
          loading={isLoading} />
      </div>
      <div className="py-20 mb-10">
        <ProductHolder
          adImage="/Ads/Ad-3.png"
          rank={3}
          tag="Top Rated"
          prodData={myData?.sort((a: PricingProps, b: PricingProps) => getAverageRating(b) - getAverageRating(a))?.slice(0, 10)} loading={isLoading} />
      </div>
      <div className="py-20">
        <ProductShowCase />
      </div>

      <div className="pb-10">
        {(existingRecentlyViewed?.product?.length > 0 && existingRecentlyViewed?.user === data?._id) &&
          <RecentlyViewedProducts tag={true} products={memoizedProducts} />}
      </div>
    </div>
  );
}
