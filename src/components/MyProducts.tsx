"use client"

import 'swiper/css';
import axios from 'axios';
import Image from 'next/image';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';
import { PenLine, Trash } from 'lucide-react';
import { Key, useEffect, useState } from 'react'
import EditDetailsModal from './EditDetailsModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, } from 'swiper/modules';

const MyProducts = ({ sellerId, load }: { sellerId: string, load: boolean }) => {

    const [prodData, setProdData] = useState([]);
    const [editModal, setEditModal] = useState(false)
    const [oldName, setOldName] = useState("");
    const [oldDescripion, setOldDescripion] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [oldDiscount, setOldDiscount] = useState("");
    const [oldSize, setOldSize] = useState("");
    const [currentId, setCurrentId] = useState("");

    async function getSellerProducts() {
        try {
            const response = await axios.post('/api/getSellerProducts', { sellerId });
            setProdData(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handelDelete = async (productId: string) => {

        try {
            const response = await axios.delete('/api/deleteProduct', { data: { sellerId, productId } })

            if (response.data.product) {
                toast.success("Product Deleted");
            }

            await getSellerProducts();

        } catch (error) {
            toast.error("Failed to delete the product. Try Again")
            console.log(error)
        }
    }

    useEffect(() => {
        getSellerProducts()
    }, [load])


    return (
        <>
            {
                prodData.length === 0 ?
                    <div className='text-center w-full py-10 animate-pulse font-semibold text-lg antialiased'>
                        No Products Found
                    </div> :
                    <div className='grid grid-cols-4 py-10 gap-10'>
                        {
                            prodData.map(
                                ({ _id, name, description, images, price, discount, size }: any) => {
                                    return (
                                        <div key={_id} className='border p-5 dark:border-gray-500'>
                                            <div className=''>
                                                <Swiper modules={[EffectFade, Pagination]}
                                                    pagination={{ clickable: true }} spaceBetween={50} effect="card" className='border rounded dark:border-gray-500'>
                                                    {images.map((elem: string, index: Key | null | undefined) => {
                                                        return (
                                                            <SwiperSlide key={index} className=''>
                                                                <Image src={elem} loading='lazy' alt='image prod' width={300} height={200} className='h-[300px] w-full object-cover rounded' />
                                                            </SwiperSlide>
                                                        )
                                                    })}
                                                </Swiper>
                                                <h1 className='capitalize text-xl font-bold antialiased py-2 line-clamp-2'>
                                                    {name}
                                                </h1>
                                                <p className='text-base text-gray-500 line-clamp-3'>
                                                    {description}
                                                </p>
                                                <div className='py-2 flex items-center gap-5 justify-between'>
                                                    <h1 className='font-light '>
                                                        <span className='font-semibold'> Price </span> ₹ {price}
                                                    </h1>
                                                    <h1 className='font-light '>
                                                        <span className='font-semibold'>  Discount </span> ₹ {discount}
                                                    </h1>
                                                </div>
                                                <div className='font-light '>
                                                    <span className='font-semibold'>  Total </span> ₹ {price - discount}
                                                </div>
                                                <div className='py-2 flex items-center gap-3'>
                                                    <button className='px-3 py-1 bg-green-500 hover:bg-green-700 transition-colors ease-in-out duration-200 rounded text-white flex items-center justify-center gap-2' onClick={() => {
                                                        setEditModal(true)
                                                        setOldName(name);
                                                        setOldPrice(price);
                                                        setOldDescripion(description);
                                                        setOldDiscount(discount);
                                                        setOldSize(size);
                                                        setCurrentId(_id);
                                                    }}>
                                                        Edit
                                                        <span><PenLine className='h-4 w-4' /></span>
                                                    </button>
                                                    <button className='px-3 py-1 bg-red-500 hover:bg-red-700 transition-colors ease-in-out duration-200 rounded text-white flex items-center justify-center gap-2'
                                                        onClick={() => { handelDelete(_id) }}>
                                                        Delete
                                                        <span><Trash className='h-4 w-4' /></span>
                                                    </button>
                                                </div>
                                            </div>
                                            <EditDetailsModal
                                                isVisible={editModal}
                                                onClose={() => { return setEditModal(false) }}
                                                oldName={oldName}
                                                oldDescripion={oldDescripion}
                                                oldPrice={oldPrice}
                                                oldDiscount={oldDiscount}
                                                oldSize={oldSize}
                                                id={currentId}
                                                reRender={() => { return getSellerProducts() }}
                                            />
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
            }
        </>
    )
}

export default MyProducts