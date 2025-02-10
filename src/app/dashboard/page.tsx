"use client"

import DashBoardActionBar from '@/components/DashBoardActionBar'
import DashBoardStats from '@/components/DashBoardStats'
import Loader from '@/components/Loader';
import { useUserStore } from '@/store/UserStore';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { data }: any = useUserStore();
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages]: any = useState(null)
    const [price, setPrice]: any = useState(0)
    const [discount, setDiscount]: any = useState(0)
    const [size, setSize]: any = useState(0)
    const [category, setCategory] = useState("")


    const handelSubmit = async (e: any) => {

        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('images', images);
            formData.append('name', name);
            formData.append('seller', data._id);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('size', size);
            formData.append('category', category);

            const response = await axios.post('/api/addProduct', formData);

            if (!response.data) {
                setLoading(false)
                toast.error('Error Adding Product')
            }

            console.log(response.data)

            toast.success("Product Added Successfully")

            setLoading(false);
            setName("")
            setDescription("")

        } catch (error) {
            setLoading(false)
            throw new Error(`Failed to add Product : ${error}`)
        }
    }
    return (
        <div className='h-screen'>
            <DashBoardStats />
            <DashBoardActionBar />

            <section className='flex items-center justify-center min-h-screen '>
                <div className='w-[500px] flex items-center justify-center px-10 py-16 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                    <form onSubmit={handelSubmit} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                        <h1 className='text-center text-4xl uppercase font-semibold'>Add products</h1>
                        <div className='w-full'>
                            <label>Name :</label>
                            <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Name' required onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Description :</label>
                            <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Description' required onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Images :</label>
                            <input type="file" className='text-black px-3 py-2 w-full rounded bg-white' placeholder='Images' required onChange={(e: any) => {
                                setImages(e.target.files[0])
                            }}
                                multiple />
                        </div>
                        <div className='w-full'>
                            <label>Price :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Price' required onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Size :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Size' required onChange={(e) => setSize(e.target.value)} />
                        </div>
                        <div className='w-full'>
                            <label>Discount :</label>
                            <input type="number" className='text-black px-3 py-2 w-full rounded' placeholder='Size' required onChange={(e) => setDiscount(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <label>Category :</label>
                            <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Category' required onChange={(e) => setCategory(e.target.value)} />
                        </div>

                        <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                            {
                                loading ?
                                    <Loader title='Adding ' /> :
                                    "Add products"
                            }
                        </button>
                    </form>
                </div >
            </section >
        </div >
    )
}

export default Dashboard