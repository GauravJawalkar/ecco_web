"use client"

import Loader from '@/components/Loaders/Loader';
import axios from 'axios'
import Image from 'next/image';
import React, { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface mapProps {
    _id: string
    email: string,
    sellerId: string,
    isEmailVerified: boolean,
    avatar: string
}

interface authorizeProps {
    sellerId: string,
    _id: string,
}

const page = () => {

    const [sellerData, setSellerData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handelAuthorize = async (sellerId: string, _id: string) => {

        try {
            setLoading(true)
            const response = await axios.post('/api/authorizeSeller', { sellerId, _id })

            if (response.data.data) {
                setLoading(false)
                toast.success("Seller Authorized");
                getSellerRequests();
            } else {
                setLoading(false)
                toast.error("Error Authorizing");
            }

        } catch (error) {
            setLoading(false)
            console.log("Error Authorizing : ", error)
        }
    }

    async function getSellerRequests() {
        try {
            const response = await axios.get('/api/getSellerRequests')

            if (response.data.data) {
                setSellerData(response.data.data);
                toast.success("Seller requests fetched ")
            } else {
                setSellerData([]);
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {

        getSellerRequests();
    }, [])


    return (
        <div className='min-h-screen'>
            {
                sellerData.length !== 0 ? sellerData?.map(({ _id, email, sellerId, isEmailVerified, avatar }: mapProps) => {
                    return (
                        <div key={_id} className='flex items-center justify-center my-10 gap-10 border py-4 w-full '>
                            <div className='flex items-center justify-center gap-5'>
                                Seller :<Image src={avatar} height={200} width={200} className='h-10 w-10 object-contain rounded-full border-2' alt='Seller Avatar' />
                            </div>
                            <div>Email : {email}</div>
                            <div>Seller Id : {sellerId}</div>
                            <div>Verified : {isEmailVerified ? "✅" : "❌"}</div>
                            <button className='bg-blue-500 hover:bg-blue-600 transition-all ease-linear duration-200 px-4 py-2 rounded text-white'
                                onClick={(e: FormEvent) => {
                                    e.preventDefault();
                                    handelAuthorize(sellerId, _id)
                                }
                                } >
                                {
                                    loading ?
                                        <Loader title="Authorizing" /> :
                                        "Authorize"
                                }</button>
                        </div>
                    )
                }) : <div className='flex items-center justify-center my-10 gap-10 border py-4 w-full '>
                    No Requests To Authorize
                </div>
            }
        </div>
    )
}

export default page