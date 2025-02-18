"use client"

import axios from 'axios';
import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/UserStore';

const MyProducts = ({ sellerId }: { sellerId: string }) => {

    const [prodData, setProdData] = useState([]);
    // const sellerId = data?._id;


    const getSellerProducts = async () => {

        try {
            const response = await axios.post('/api/getSellerProducts', { sellerId });
            console.log("response is :", response);
            setProdData(response.data.data)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSellerProducts()
    }, [])


    return (
        <div>
            YOoo: {
                prodData.length === 0 ? "No Products Found" :
                    prodData.map(({ _id, name, description, images }) => {
                        return <div key={_id}>
                            {_id},
                            {name},
                            {description},
                            {images}
                        </div>
                    })}
        </div>
    )
}

export default MyProducts