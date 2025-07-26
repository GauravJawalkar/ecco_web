"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import "swiper/css";
import "../../app/globals.css";
import { useState } from "react";
import Loader from "../Loaders/Loader";
import Link from "next/link";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { discountPercentage } from "@/helpers/discountPercentage";
import { useRouter } from "next/navigation";


interface holderProps {
  _id: string,
  name: string,
  price: number,
  images: ["", "", ""],
  discount: number,
  seller: string,
  stock: number,
  rating: [],
  category: string
}

const ProductHolder = ({ rank, prodData, loading, tag }: { rank: number, prodData: any, loading: boolean, tag: string }) => {
  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
  const { data }: any = useUserStore();
  const cartOwnerId = data?._id;
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [sellerId, setSellerId] = useState("");
  const [productId, setProductId] = useState("");
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const router = useRouter();

  async function addToCart() {
    try {
      const cartOwner = data?._id;
      const response = await axios.post('../api/addToCart', { cartOwner, name, price, image, discount, stock, productId, sellerId });
      if (response.data.data) {
        toast.success("Item Added To Cart");
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      console.error("Error Adding the product to cart ", error);
      if (error.response.status === 403) {
        toast.error("Unauthorized!");
        return router.push('/login');
      }
    }
  }

  const addToCartMutation = useMutation({
    mutationFn: async () => await addToCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCart', cartOwnerId] });
    },
    onError: () => {
      toast.error("Error Adding the product to cart ");
    }
  });

  const handelCart = async () => {
    addToCartMutation.mutate();
  }

  const getAverageRating = (rating: { rateNumber: number }[]) => {
    if (rating?.length === 0) return 0;
    const total = rating?.reduce((sum, r) => sum + r.rateNumber, 0);
    return total / rating?.length;
  };

  return (
    <div className="my-10">
      <div className="grid grid-cols-[1fr_2fr] gap-10 h-64"
        dir={`${rank % 2 ? "ltr" : "rtl"}`}>
        <div className="place-content-center text-center p-3 py-0 relative">
          <Image src={"/Ads/Ad-1.png"} alt={"advertisement"} width={2000} height={1000} className="w-full h-full rounded-3xl" />
          {tag.trim() !== "" && <h1 className={`absolute top-0 ${rank % 2 ? "right-3 rounded-tr-xl rounded-bl-xl border-t border-r" : "left-3 rounded-tl-xl rounded-br-xl border-t border-l"} bg-white px-3 py-1 dark:border-neutral-700 dark:text-black`}>{tag}</h1>}
        </div>

        <div className="h-auto max-w-[87ch] prod-holder relative ">

          {loading && <div className="flex items-center justify-center">
            <Loader title={"Fetching..."} />
          </div>}

          {/* Product Card */}
          <Swiper
            slidesPerView={3}
            pagination={{ clickable: true }}
            navigation={false}
            modules={[Pagination, Navigation]}
            loop={prodData?.length > 3}
            onSwiper={(swiper) => {
              setSwiperInstance(swiper); // store swiper instance in state
            }}
          >

            {
              prodData?.map(({ _id, name, price, images, discount, seller, stock, rating, category }: holderProps) => {
                return (
                  <SwiperSlide className="px-2 w-full " key={_id}>
                    <Link passHref href={`/products/${slugify(name)}?id=${_id}`} className="content-center flex items-center justify-center flex-col cursor-pointer dark:bg-neutral-800 bg-gray-100 rounded-b-3xl rounded-t-2xl w-full">
                      <div className="w-full py-3 relative">
                        <Image
                          src={images?.[0] || ""}
                          alt="prodImage"
                          width={"180"}
                          height={"180"}
                          className="object-contain h-64 w-full" />
                        <div className='absolute top-0 right-0 z-10'>
                          <h1 className='px-3 bg-green-600 rounded-tr-xl rounded-bl-xl text-white'>{Math.round(discountPercentage(price, discount))} % Off</h1>
                        </div>
                      </div>
                      <div dir={"ltr"} className="p-4 w-full bg-white/80 dark:bg-neutral-900/80 dark:border-neutral-700 rounded-3xl border">
                        <div className="text-start text-sm text-gray-500 flex items-center justify-between pb-2">
                          <h1 className="capitalize">{(category === "accessories" || category === "fertilizers") && category || "plants"}</h1>
                          <h1>⭐ {getAverageRating(rating)?.toFixed(1)}</h1>
                        </div>
                        <h1 title={name} className="font-semibold capitalize text-start text-lg truncate">
                          {name}
                        </h1>
                        <div className="flex items-center justify-between pt-2">
                          <button type="button" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setName(name);
                            setImage(images?.[0]);
                            setPrice(price);
                            setStock(stock);
                            setDiscount(discount);
                            setSellerId(seller);
                            setProductId(_id);
                            handelCart();
                          }} className="py-2 px-4 border rounded-full text-sm flex items-center justify-center gap-3 dark:border-neutral-700 dark:hover:bg-neutral-800 hover:bg-gray-100">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Add To Cart</span>
                          </button>
                          <h1 className="font-semibold text-lg uppercase">
                            ₹ {(price - discount)?.toLocaleString()}
                          </h1>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })
            }
          </Swiper>

          {swiperInstance && (rank % 2 ? (
            <button
              onClick={() => swiperInstance.slideNext()}
              className="absolute top-1/2 -right-5 z-10 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 transition-all ease-linear duration-200 py-5 px-2 text-neutral-800 rounded border border-gray-300 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700"
            >
              <ChevronRight />
            </button>
          ) : (
            <button
              onClick={() => swiperInstance.slideNext()}
              className="absolute top-1/2 left-5 z-10 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 transition-all ease-linear duration-200 py-5 px-2 text-neutral-800 rounded border border-gray-300 dark:bg-neutral-800 dark:text-gray-300 dark:border-neutral-700"
            >
              <ChevronLeft />
            </button>
          ))}
        </div>
      </div>
    </div >
  );
};

export default ProductHolder;
