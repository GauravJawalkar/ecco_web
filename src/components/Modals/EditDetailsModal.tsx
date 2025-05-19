"use client"
import React, { useEffect, useState } from 'react'
import Loader from '../Loaders/Loader'
import { CircleX } from 'lucide-react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface editDetailsProps {
    onClose: () => void;
    oldName: string;
    oldDescripion: string;
    oldPrice: string;
    oldDiscount: string;
    oldStock: string;
    oldSize: string;
    oldCategory: string;
    isVisible: boolean;
    id: string;
    reRender: () => {};
}

const EditDetailsModal = ({ isVisible, onClose, oldName, oldDescripion,
    oldPrice, oldDiscount, oldSize, oldCategory, oldStock, id, reRender }: editDetailsProps) => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [size, setSize] = useState("");
    const [loading, setLoading] = useState(false);
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await axios.put('/api/editProductDetails', { id, name, description, price, discount, size, stock, category });
            if (response.data.data) {
                toast.success("Updated Successfully")
                setLoading(false);
                onClose();
                reRender();
            } else {
                toast.error("Failed to update")

            }

        } catch (error) {
            setLoading(false)
            console.log("Error updating details : ", error)
            toast.error("Failed to update")
        }

    }

    async function getCategories() {
        try {
            const response = await axios.get('/api/getCategories')
            if (response.data.data) {
                return response.data.data
            } else {
                return [];
            }
        } catch (error) {
            console.log("Error fetching the categories : ", error);
            return [];
        }
    }

    useEffect(() => {
        setName(oldName);
        setDescription(oldDescripion);
        setPrice(oldPrice);
        setDiscount(oldDiscount);
        setCategory(oldCategory);
        setSize(oldSize);
        setStock(oldStock);
    }, [oldName, oldDescripion, oldPrice, oldSize, oldPrice, id, oldStock, oldCategory])

    const { data: fetchedCategories = [] } = useQuery({
        queryKey: ['fetchedCategories'],
        queryFn: getCategories
    })

    if (!isVisible) return null;


    return (
        <section className='inset-0 fixed h-auto flex items-center justify-center z-10 backdrop-blur '>
            <div className='w-[600px]  px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 relative '>
                <div className='absolute -right-2 -top-3'>
                    <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                </div>
                <form onSubmit={handelSubmit} className=' gap-5 flex-col min-w-full grid grid-cols-2'>
                    <div className='w-full'>
                        <label>Name :</label>
                        <input
                            type="text"
                            value={name}
                            className='text-black px-3 py-2 w-full rounded'
                            placeholder='Name'
                            required
                            onChange={(e) => { setName(e.target.value) }} />
                    </div>
                    <div className='w-full'>
                        <label>Description :</label>
                        <input
                            type="text"
                            value={description}
                            className='text-black px-3 py-2 w-full rounded'
                            placeholder='Description'
                            required
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Price :</label>
                        <input
                            type="number"
                            value={price}
                            className='text-black px-3 py-2 w-full rounded'
                            placeholder='Price'
                            required
                            onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Discount :</label>
                        <input
                            type="number"
                            value={discount}
                            className='text-black px-3 py-2 w-full rounded'
                            placeholder='Discount'
                            required
                            onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Stock :</label>
                        <input
                            type="number"
                            value={stock}
                            className='text-black px-3 py-2 w-full rounded'
                            placeholder='Discount'
                            required
                            onChange={(e) => setStock(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Size :</label>
                        <input
                            type="number"
                            value={size}
                            className='text-black px-3 py-2 w-full rounded'
                            placeholder='Size'
                            required
                            onChange={(e) => setSize(e.target.value)} />
                    </div>

                    <div className='w-full'>
                        <label>Category :</label>
                        <select
                            value={category}
                            className='text-black px-3 py-2 w-full rounded'
                            required
                            onChange={(e) => setCategory(e.target.value)} >
                            <option>Select Category</option>
                            {
                                fetchedCategories.length !== 0 && fetchedCategories?.map(({ categoryName, _id }: { categoryName: string, _id: string }) => {
                                    return (
                                        <option key={_id}>{categoryName}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <button
                        type='submit'
                        className='w-full h-fit py-2 bg-[#0a0a0a] text-[#ededed] rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {
                            loading ?
                                <Loader title='Updating ' /> :
                                "Update Details"
                        }
                    </button>
                </form>
            </div >
        </section >
    )
}

export default EditDetailsModal