"use client"

import { useUserStore } from "@/store/UserStore"
import axios from "axios";

const page = () => {
    const { data }: any = useUserStore();
    async function getSellerOrders() {
        const id = data?._id;
        try {
            const response = await axios.get(`/api/getSellerOrders/${id}`);
            if (response.data.data) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching the seller Orders", error);
        }
    }
    return (
        <section>
            <div>
                <h1>Order Processing</h1>
            </div>
        </section>
    )
}

export default page