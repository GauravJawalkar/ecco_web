"use client"
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { CircleX } from 'lucide-react'
import axios from 'axios';
import toast from 'react-hot-toast';

interface editDetailsProps {
    onClose: () => void;
    oldName: string;
    oldDescripion: string;
    oldPrice: string;
    oldDiscount: string;
    oldSize: string;
    isVisible: boolean;
    id: string
}

const EditDetailsModal = ({ isVisible, onClose, oldName, oldDescripion,
    oldPrice, oldDiscount, oldSize, id }: editDetailsProps) => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [size, setSize] = useState("")
    const [loading, setLoading] = useState(false);

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await axios.put('/api/editProductDetails', { id, name, description, price, discount, size });

            console.log(response.data.data);

            toast.success("Updated Successfully")

        } catch (error) {
            setLoading(false)
            console.log("Error updating details : ", error)
        }

    }

    useEffect(() => {
        setName(oldName);
        setDescription(oldDescripion);
        setPrice(oldPrice);
        setDiscount(oldDiscount);
        setSize(oldSize)
    }, [oldName, oldDescripion, oldPrice, oldSize, oldPrice, id])



    if (!isVisible) return null;


    return (
        <section className='inset-0 fixed bg-opacity-5 opacity-1 h-screen flex items-center justify-center z-10 backdrop-blur-md'>
            <div className='w-[500px] flex items-center justify-center px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 '>
                <form onSubmit={handelSubmit} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <div className='text-end'>
                        <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                    </div>
                    <div className='w-full'>
                        <label>Name :</label>
                        <input type="text" value={name} className='text-black px-3 py-2 w-full rounded' placeholder='Name' required onChange={(e) => { setName(e.target.value) }} />
                    </div>
                    <div className='w-full'>
                        <label>Description :</label>
                        <input type="text" value={description} className='text-black px-3 py-2 w-full rounded' placeholder='Description' required onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Price :</label>
                        <input type="number" value={price} className='text-black px-3 py-2 w-full rounded' placeholder='Price' required onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Discount :</label>
                        <input type="number" value={discount} className='text-black px-3 py-2 w-full rounded' placeholder='Discount' required onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                    <div className='w-full'>
                        <label>Size :</label>
                        <input type="number" value={size} className='text-black px-3 py-2 w-full rounded' placeholder='Size' required onChange={(e) => setSize(e.target.value)} />
                    </div>

                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
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