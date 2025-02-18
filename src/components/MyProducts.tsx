"use client"

import axios from 'axios';
import { Key, useEffect, useState } from 'react'

const MyProducts = ({ sellerId }: { sellerId: string }) => {

    const [prodData, setProdData] = useState([]);

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
                    prodData.map(({ _id, name, description, images }: any) => {
                        return <div key={_id}>
                            {_id},
                            {name},
                            {description},
                            <br />
                            {images.map((elem: string, index: Key | null | undefined) => {
                                <br />
                                return (
                                    <div key={index}>
                                        {elem}
                                    </div>
                                )
                            })}
                        </div>
                    })}
        </div>
    )
}

export default MyProducts