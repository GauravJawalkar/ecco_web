"use client"
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const MyProducts = () => {

    const { data }: any = useUserStore();
    const [prodData, setProdData] = useState("");


    console.log("seller id is ", data._id);

    async function getSellerProducts() {
        try {

            const sellerId = await data._id;

            const response = await axios.post('/api/getSellerProducts', { sellerId });
            console.log("response is :", response);
            setProdData(response.data.data);

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getSellerProducts();
    }, [])

    return (
        <div>
            {prodData}
        </div>
    )
}

export default MyProducts