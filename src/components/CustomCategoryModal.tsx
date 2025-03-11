"use client"

import React, { useState } from 'react'
import Loader from './Loader'
import { CircleX } from 'lucide-react'
import toast from 'react-hot-toast'

interface CustomCategoryModalProps {
    onClose: () => void,
    isVisible: boolean,
}

const CustomCategoryModal = ({ onClose, isVisible }: CustomCategoryModalProps) => {

    const [categoryName, setCategoryName] = useState("")
    const [loading, setLoading] = useState(false)

    const handelSubmit = () => {
        try {

        } catch (error) {
            toast.error("Failed to upload a category");
            console.log("Error is : ", error)
        }
    }

    if (!isVisible) return null;
    return (
        <section className='inset-0 absolute flex items-center justify-center backdrop-blur-md z-10 h-screen'>
            <div className='w-[500px] flex items-center justify-center px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={handelSubmit} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <div className='text-end'>
                        <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                    </div>
                    <div className='w-full'>
                        <label>CUSTOM CATEGORY :</label>
                        <input type="text" className='text-black px-3 py-2 w-full rounded' placeholder='Custom Category Name' required onChange={(e) => setCategoryName(e.target.value)} />
                    </div>

                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {
                            loading ?
                                <Loader title='Adding ' /> :
                                "Add Category"
                        }
                    </button>
                </form>
            </div >
        </section >
    )
}

export default CustomCategoryModal