"use client"
import React, { useEffect, useState } from 'react'
import Loader from '../Loaders/Loader'
import { CircleX, X } from 'lucide-react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/UserStore';

interface editDetailsProps {
    onClose: () => void;
    oldName: string;
    oldDescripion: string;
    oldPrice: string;
    oldDiscount: string;
    oldStock: string;
    oldSize: string;
    oldCategory: string;
    oldContainer: string;
    isVisible: boolean;
    id: string;
}

const EditDetailsModal = ({ isVisible, onClose, oldName, oldDescripion,
    oldPrice, oldDiscount, oldSize, oldCategory, oldStock, id, oldContainer }: editDetailsProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const { data }: any = useUserStore();
    const [discount, setDiscount] = useState("");
    const [size, setSize] = useState("");
    const [container, setContainer] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const queryClient = useQueryClient();

    async function editProductDetails() {
        try {
            const response = await axios.put('/api/editProductDetails', { id, name, description, price, discount, size, stock, category, container });
            if (response.data.data) {
                return response.data.data || [];
            } else {
                toast.error("Failed to update")
                console.error("Error updating the details");
                return [];
            }
        } catch (error) {
            console.error("Error updating details : ", error)
            toast.error("Failed to update")
        }
    }

    const editProductDetailsMutation = useMutation(
        {
            mutationKey: ['eidtProductDetails'],
            mutationFn: editProductDetails,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['sellerProducts', data?._id] });
                onClose();
            },
            onError: (error) => {
                toast.error("Failed to update");
                console.error("Error updating details : ", error);
            }
        }
    )

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        editProductDetailsMutation.mutate();
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
        setContainer(oldContainer);
        setStock(oldStock);
    }, [oldName, oldDescripion, oldPrice, oldSize, oldPrice, id, oldStock, oldCategory, oldContainer])

    const { data: fetchedCategories = [] } = useQuery({
        queryKey: ['fetchedCategories'],
        queryFn: getCategories
    })

    if (!isVisible) return null;

    return (
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='relative w-full max-w-3xl p-8 bg-white shadow-lg dark:bg-neutral-800 rounded-xl'>
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Edit Product Details</h2>
                <form onSubmit={handelSubmit} className='gap-5 flex-col min-w-full grid grid-cols-2 text-sm'>
                    <div className='w-full space-y-1'>
                        <label>Name :</label>
                        <input
                            type="text"
                            value={name}
                            className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700'
                            placeholder='Name'
                            required
                            onChange={(e) => { setName(e.target.value) }} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>Description :</label>
                        <input
                            type="text"
                            value={description}
                            className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700'
                            placeholder='Description'
                            required
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>Price :</label>
                        <input
                            type="number"
                            value={price}
                            className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700'
                            placeholder='Price'
                            required
                            onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>Discount :</label>
                        <input
                            type="number"
                            value={discount}
                            className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700'
                            placeholder='Discount'
                            required
                            onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>Stock :</label>
                        <input
                            type="number"
                            value={stock}
                            className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700'
                            placeholder='Discount'
                            required
                            onChange={(e) => setStock(e.target.value)} />
                    </div>
                    <div className='w-full space-y-1'>
                        <label>Size :</label>
                        <select value={oldSize} className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700' onChange={(e) => { setSize(e.target.value) }}>
                            <option>Select Size</option>
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                        </select>
                    </div>

                    <div className='w-full space-y-1'>
                        <label>Container :</label>
                        <select value={oldContainer} className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700' onChange={(e) => { setContainer(e.target.value) }}>
                            <option>Select Container</option>
                            <option>Growth Bag</option>
                            <option>Pot</option>
                        </select>
                    </div>

                    <div className='w-full space-y-1'>
                        <label>Category :</label>
                        <select
                            value={category}
                            className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700'
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
                        className='w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700 disabled:cursor-not-allowed'>
                        {
                            editProductDetailsMutation.isPending ?
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