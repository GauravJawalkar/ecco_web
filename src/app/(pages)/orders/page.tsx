"use client"
import { useUserStore } from '@/store/UserStore'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'

const page = () => {
    const { data }: any = useUserStore();

    async function getMyOrders() {
        const userId = data?._id
        try {
            const response = await axios.get(`/api/getOrders/${userId}`);
            if (response.data.data) {
                return response.data.data
            }

            return [];
        } catch (error) {
            console.error("Error fetching the user orders: ", error);
            return [];
        }
    }

    const { data: myOrders = [], isPending, isError } = useQuery({
        queryKey: ['myOrders'],
        queryFn: getMyOrders,
        enabled: !!data?._id,
        refetchOnWindowFocus: false
    })
    return (
        <div>{JSON.stringify(myOrders)}</div>
    )
}

export default page