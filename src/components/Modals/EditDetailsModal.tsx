"use client"
import React, { useEffect, useState } from 'react'
import Loader from '../Loaders/Loader'
import { CircleX, X } from 'lucide-react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/UserStore';
import Image from 'next/image';
import ApiClient from '@/interceptors/ApiClient';

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
    oldImages: String[];
    id: string;
}

const EditDetailsModal = ({ isVisible, onClose, oldName, oldDescripion,
    oldPrice, oldDiscount, oldSize, oldCategory, oldStock, id, oldContainer, oldImages }: editDetailsProps) => {
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
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [secondImage, setSecondImage] = useState<File | null>(null);
    const [thirdImage, setThirdImage] = useState<File | null>(null);

    async function editProductDetails() {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('size', size);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('container', container);
        if (mainImage) {
            formData.append('mainImage', mainImage)
        } else {
            formData.append('mainImage', oldImages?.[0].toString())
        }
        if (secondImage) {
            formData.append('secondImage', secondImage)
        } else {
            formData.append('secondImage', oldImages?.[1].toString())
        }
        if (thirdImage) {
            formData.append('thirdImage', thirdImage)
        } else {
            formData.append('thirdImage', oldImages?.[2].toString())
        }

        try {
            const response = await ApiClient.put('/api/editProductDetails', formData);
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
        if (size === "Select Size") {
            toast.error("Please select a valid size.");
            return;
        }
        if (container === "Select Container") {
            toast.error("Please select a valid container.");
            return;
        }
        if (category === "Select Category") {
            toast.error("Please select a valid category.");
            return;
        }
        editProductDetailsMutation.mutate();
    }

    const getPreviewUrl = (file: File | null) => file ? URL.createObjectURL(file) : null;

    async function getCategories() {
        try {
            const response = await ApiClient.get('/api/getCategories')
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

    useEffect(() => {
        if (!isVisible) {
            setMainImage(null);
            setSecondImage(null);
            setThirdImage(null);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='relative w-full max-w-3xl p-8 bg-white shadow-lg dark:bg-neutral-800 rounded-xl'>
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={() => { onClose(); }} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Edit Product Details</h2>
                <form onSubmit={handelSubmit} className='min-w-full grid grid-cols-2 gap-5 text-sm'>
                    {/* Left column: text fields */}
                    <div className="space-y-4">
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
                            <textarea
                                value={description}
                                className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700'
                                placeholder='Description'
                                required
                                rows={1}
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
                                placeholder='Stock'
                                required
                                onChange={(e) => setStock(e.target.value)} />
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
                                            <option key={_id} className='capitalize'>{categoryName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    {/* Right column: image uploads */}
                    <div className="space-y-4 flex flex-col items-center justify-start">
                        <div className='w-full space-y-1'>
                            <label>Main Image :</label>
                            <div className='flex items-center gap-x-2'>
                                <input
                                    type="file"
                                    className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMainImage(e.target.files?.[0] || null)}
                                />
                                <Image
                                    src={mainImage ? getPreviewUrl(mainImage)! : `${oldImages?.[0]}`}
                                    width={200}
                                    height={200}
                                    alt="main-image"
                                    className="object-contain border dark:border-neutral-700 rounded-full w-10 h-10 dark:bg-neutral-700"
                                />
                            </div>
                        </div>
                        <div className='w-full space-y-1'>
                            <label>Second Image :</label>
                            <div className='flex items-center gap-x-2'>
                                <input
                                    type="file"
                                    className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecondImage(e.target.files?.[0] || null)}
                                />
                                <Image
                                    src={secondImage ? getPreviewUrl(secondImage)! : `${oldImages?.[1]}`}
                                    width={200}
                                    height={200}
                                    alt="second-image"
                                    className="object-contain border dark:border-neutral-700 rounded-full w-10 h-10 dark:bg-neutral-700"
                                />
                            </div>
                        </div>
                        <div className='w-full space-y-1'>
                            <label>Third Image :</label>
                            <div className='flex items-center gap-x-2'>
                                <input
                                    type="file"
                                    className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThirdImage(e.target.files?.[0] || null)}
                                />
                                <Image
                                    src={thirdImage ? getPreviewUrl(thirdImage)! : `${oldImages?.[2]}`}
                                    width={200}
                                    height={200}
                                    alt="third-image"
                                    className="object-contain border dark:border-neutral-700 rounded-full w-10 h-10 dark:bg-neutral-700"
                                />
                            </div>
                        </div>

                        <div className='w-full space-y-1'>
                            <label>Size :</label>
                            <select value={size} className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700' onChange={(e) => { setSize(e.target.value) }}>
                                <option>Select Size</option>
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                            </select>
                        </div>
                        <div className='w-full space-y-1'>
                            <label>Container :</label>
                            <select value={container} className='text-black px-3 py-2 w-full rounded border dark:border-neutral-700' onChange={(e) => { setContainer(e.target.value) }}>
                                <option>Select Container</option>
                                <option>Growth Bag</option>
                                <option>Pot</option>
                                <option>Box</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='col-span-2 w-full px-4 py-2 h-fit font-semibold text-white transition bg-green-600 rounded hover:bg-green-700 disabled:cursor-not-allowed mt-4'>
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