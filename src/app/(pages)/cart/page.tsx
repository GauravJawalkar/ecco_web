"use client"

import { useUserStore } from "@/store/UserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios"
import Image from "next/image";
import toast from "react-hot-toast";


interface cartMappingProps {
    name: string,
    price: number,
    image: string,
    quantity: number,
}

const Cart = () => {
    const { data }: any = useUserStore();
    const cartOwnerId = data?._id

    async function getCartItems() {
        try {

            let cartOwnerId = data?._id;
            const response = await axios.get(`api/getCart/${cartOwnerId}`);
            if (response.data.data) {
                return response.data.data
            }
            return [];
        } catch (error) {
            console.error("Error getting the cart details :", error);
            return [];
        }
    }

    const { data: userCart = [] } = useQuery({
        queryFn: getCartItems,
        queryKey: ['userCart', cartOwnerId],
        enabled: !!cartOwnerId,
        refetchOnWindowFocus: false,
    })
    return (
        <section>
            {userCart?.cartItems?.length <= 0 ? <div className='text-2xl font-semibold text-center py-10'>Your Cart</div> : <div className='text-2xl font-semibold text-center py-10'>Your Cart Is Empty</div>}
            <div>
                {
                    userCart?.cartItems?.length > 0 && userCart?.cartItems?.map(({ name, price, image, quantity }: cartMappingProps) => {
                        return (
                            <div key={name + price}>
                                {name}
                                <br />
                                {price}
                                <br />
                                {quantity}
                                <Image width={200} height={200} src={image || '/userProfile.png'} alt={"cartImage"} className="h-20 w-20" />
                            </div>
                        )
                    })
                }
            </div>
        </section >
    )
}

export default Cart