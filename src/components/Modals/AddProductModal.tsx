"use client"
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { CircleX } from 'lucide-react';
import Loader from '../Loaders/Loader';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddProductModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    const queryClient = useQueryClient();
    const { data }: any = useUserStore();
    const [loading, setLoading] = useState(false);
    const [imgArray, setImgArray] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [size, setSize] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [primeImage, setPrimeImage] = useState("");
    const [secondImage, setSecondImage] = useState("");
    const [exCategories, setExCategories] = useState([]);

    const handelFileChanges = async (e: any) => {
        setImgArray(Array.from(e.target.files))
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

    async function addProduct() {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('images', images);
            formData.append('primeImage', primeImage);
            formData.append('secondImage', secondImage);
            formData.append('name', name);
            formData.append('seller', data._id);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('size', size);
            formData.append('stock', stock);
            formData.append('stock', stock);
            formData.append('category', category);

            const response = await axios.post('/api/addProduct', formData);

            if (response.data.data) {
                setName("");
                setDescription("");
                setImages("");
                setPrice("");
                setDiscount("");
                setSize("");
                setStock("");
                setCategory("");
                setImgArray([]);
                setLoading(false);
                onClose();
                toast.success("Product Added Successfully");
                return response.data.data
            } else {
                setLoading(false)
                toast.error('Error Adding Product')
            }

        } catch (error) {
            setLoading(false)
            console.log("Error in adding the product", error);
        }
    }

    useEffect(() => {
        setImages(imgArray[0]);
        setPrimeImage(imgArray[1]);
        setSecondImage(imgArray[2]);
    }, [imgArray])

    useEffect(() => {
        async function getCategories() {
            try {
                const response = await axios.get('/api/getCategories')
                if (response.data.data) {
                    setExCategories(response.data.data)
                } else {
                    setExCategories([]);
                }
            } catch (error) {
                console.log("Error fetching the categories : ", error);
                return [];
            }
        }

        getCategories()
    }, [])

    if (!isVisible) return null;

    return (
        <>
            <section className='inset-0 fixed flex items-center justify-center backdrop-blur-md z-10'>
                <div className='w-1/2 flex items-center justify-center px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md relative'>
                    <div className='text-end absolute -top-3 -right-2'>
                        <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                    </div>
                    <form onSubmit={handelSubmit} className='grid grid-cols-2 gap-5 min-w-full'>
                        <div className='w-full'>
                            <label>Name :</label>
                            <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Enter Name' required onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <label>Images :</label>
                            <input type="file" className='text-black file:px-3 file:py-2  file:border-0 file:bg-gray-300 file:text-white file:mr-2 w-full rounded bg-white file:hover:cursor-pointer hover:cursor-pointer' placeholder='Images' required onChange={handelFileChanges}
                                multiple />
                        </div>
                        <div className='w-full'>
                            <label>Description :</label>
                            <textarea rows={1} className='text-black px-3 py-2 w-full rounded' placeholder='Enter Description' required onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Stock :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Enter Stock' required onChange={(e) => setStock(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Price :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Enter Price' required onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Discount :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Enter Discount' required onChange={(e) => setDiscount(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <label>Size :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Enter Size' required onChange={(e) => setSize(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <label>Category :</label>
                            <select className='text-black px-3 py-2 w-full rounded' required onChange={(e) => setCategory(e.target.value)} >
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
                        <div className='w-full'>
                            <button type='submit' className='w-full py-2 bg-[#0a0a0a] text-[#ededed]  rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                                {
                                    loading ?
                                        <Loader title='Adding...' /> :
                                        "Add product"
                                }
                            </button>
                        </div>
                    </form>
                </div >
            </section >
        </>
    )
}

export default AddProductModal