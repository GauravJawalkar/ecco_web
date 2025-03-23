"use client"

import HomeHero from "@/components/Home/HomeHero";
import ProductHolder from "@/components/Home/ProductHolder";
import ProductShowCase from "@/components/Home/ProductShowCase";
import RecommendedProducts from "@/components/Home/RecommendedProducts";

export default function Home() {
  return (
    <div className="h-full">
      <HomeHero />
      <ProductHolder rank={1} />
      <ProductHolder rank={2} />
      <ProductShowCase />
      <RecommendedProducts />
    </div>
  );
}
