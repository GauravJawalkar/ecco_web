"use client"
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { CircleX, X } from 'lucide-react';
import Loader from '../Loaders/Loader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { userProps } from '@/interfaces/commonInterfaces';

const AddProductModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    const queryClient = useQueryClient();
    const { data }: { data: userProps } = useUserStore();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [size, setSize] = useState("");
    const [container, setContainer] = useState("")
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [primeImage, setPrimeImage] = useState<File | null>(null);
    const [secondImage, setSecondImage] = useState<File | null>(null);
    const [thirdImage, setThirdImage] = useState<File | null>(null);


    async function addProduct() {
        if (size === "Select Size") {
            toast.success("Select Proper Size", {
                icon: "▄︻══━一💥"
            })
            return;
        }

        if (container === "Select Container") {
            toast.success("Select Proper Container", {
                icon: "▄︻══━一💥"
            })
            return;
        }
        try {
            const seller = data?._id;
            const formData = new FormData();
            formData.append('primeImage', primeImage as File);
            formData.append('secondImage', secondImage as File);
            formData.append('thirdImage', thirdImage as File);
            formData.append('name', name);
            formData.append('seller', seller);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('size', size);
            formData.append('container', container);
            formData.append('stock', stock);
            formData.append('stock', stock);
            formData.append('category', category);
            const response = await axios.post('/api/addProduct', formData);
            if (response.data.data) {
                toast.success("Product Added Successfully");
                onClose();
                setPrimeImage(null);
                setSecondImage(null);
                setThirdImage(null);
                return response.data.data
            } else {
                toast.error('Error Adding Product')
            }
        } catch (error) {
            console.error("Error in adding the product", error);
        }
    }

    const mutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myData'] });
        },
    })

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate()
    }

    // Image Preview
    const getPreviewUrl = (file: File | null) => {
        if (!file) {
            return null;
        }
        return URL.createObjectURL(file);
    };

    async function getCategories() {
        try {
            const response = await axios.get('/api/getCategories')
            if (response.data.data) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error fetching the categories : ", error);
            return [];
        }
    }

    const { data: exCategories = [] } = useQuery({
        queryKey: ['exCategories'],
        queryFn: getCategories
    })

    if (!isVisible) return null;

    return (
        <>
            <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
                <div className='relative w-full max-w-3xl p-8 bg-white shadow-lg dark:bg-neutral-800 rounded-xl'>
                    <button onClick={() => {
                        onClose();
                        setPrimeImage(null);
                        setSecondImage(null);
                        setThirdImage(null);
                    }} title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" aria-label="Close" >
                        <X className="w-6 h-6" />
                    </button>
                    <form onSubmit={handelSubmit} className='grid min-w-full grid-cols-2 gap-5 text-sm'>
                        <div className='space-y-4'>
                            <div className='w-full space-y-1'>
                                <label>Name :</label>
                                <input type="text" className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded' placeholder='Enter Name' required onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='w-full space-y-1'>
                                <label>Description :</label>
                                <textarea rows={1} className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded' placeholder='Enter Description' required onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className='w-full space-y-1'>
                                <label>Stock :</label>
                                <input type="number" className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded' placeholder='Enter Stock' required onChange={(e) => setStock(e.target.value)} />
                            </div>
                            <div className='w-full space-y-1'>
                                <label>Price :</label>
                                <input type="number" className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded' placeholder='Enter Price' required onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className='w-full space-y-1'>
                                <label>Discount :</label>
                                <input type="number" className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded' placeholder='Enter Discount' required onChange={(e) => setDiscount(e.target.value)} />
                            </div>
                            <div className='w-full space-y-1'>
                                <label>Size :</label>
                                <select onChange={(e) => { setSize(e.target.value) }} className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded'>
                                    <option>Select Size</option>
                                    <option>Small</option>
                                    <option>Medium</option>
                                    <option>Large</option>
                                </select>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            {/* Images */}
                            <div className='w-full space-y-1'>
                                <label>Main Image :</label>
                                <div className='flex items-center justify-center gap-2'>
                                    <input type="file" className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer' placeholder='Images' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPrimeImage(e.target.files?.[0] || null) }} />
                                    {primeImage &&
                                        <Image
                                            src={(primeImage !== null) && getPreviewUrl(primeImage) || ""}
                                            width={200}
                                            height={200}
                                            alt={'product-image'}
                                            className="object-contain border dark:border-neutral-700 rounded-full w-14 h-14 dark:bg-neutral-700" />
                                    }
                                </div>
                            </div>
                            <div className='w-full space-y-1'>
                                <label>Second Image :</label>
                                <div className='flex items-center justify-center gap-2'>
                                    <input type="file" className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer' placeholder='Images' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSecondImage(e.target.files?.[0] || null) }} />
                                    {secondImage &&
                                        <Image
                                            src={(secondImage !== null) && getPreviewUrl(secondImage) || ""}
                                            width={200}
                                            height={200}
                                            alt={'product-image'}
                                            className="object-contain border dark:border-neutral-700 rounded-full w-14 h-14 dark:bg-neutral-700" />
                                    }
                                </div>
                            </div>

                            <div className='w-full space-y-1'>
                                <label>Third Image :</label>
                                <div className='flex items-center justify-center gap-2'>
                                    <input type="file" className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer' placeholder='Images' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setThirdImage(e.target.files?.[0] || null) }} />
                                    {thirdImage &&
                                        <Image
                                            src={(thirdImage !== null) && getPreviewUrl(thirdImage) || ""}
                                            width={200}
                                            height={200}
                                            alt={'product-image'}
                                            className="object-contain border dark:border-neutral-700 rounded-full w-14 h-14 dark:bg-neutral-700" />
                                    }
                                </div>
                            </div>


                            <div className='w-full space-y-1'>
                                <label>Container :</label>
                                <select onChange={(e) => { setContainer(e.target.value) }} className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded'>
                                    <option>Select Container</option>
                                    <option>Growth Bag</option>
                                    <option>Pot</option>
                                </select>
                            </div>

                            <div className='w-full space-y-1'>
                                <label>Category :</label>
                                <select className='w-full px-3 py-2 text-black border dark:border-neutral-700 rounded' required onChange={(e) => setCategory(e.target.value)} >
                                    <option>Select Category</option>
                                    {
                                        exCategories.length !== 0 && exCategories.map(({ categoryName, _id }: { categoryName: string, _id: string }) => {
                                            return (
                                                <option key={_id}>{categoryName}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='w-full space-y-1'>
                                <button type='submit' className='w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700 disabled:cursor-not-allowed'>
                                    {
                                        mutation?.isPending ?
                                            <Loader title='Adding...' /> :
                                            "Add product"
                                    }
                                </button>
                            </div>
                        </div>


                    </form>
                </div >
            </section >
        </>
    )
}

export default AddProductModal