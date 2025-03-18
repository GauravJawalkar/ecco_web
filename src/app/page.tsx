"use client"

import HomeHero from "@/components/HomeHero";
import ProductHolder from "@/components/ProductHolder";
import ProductShowCase from "@/components/ProductShowCase";
import RecommendedProducts from "@/components/RecommendedProducts";

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
