"use client"

import React, { useState } from 'react'
import { CircleX } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Loader from '../Loaders/Loader'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CustomCategoryModalProps {
    onClose: () => void,
    isVisible: boolean,
    creator: string
}

const CustomCategoryModal = ({ onClose, isVisible, creator }: CustomCategoryModalProps) => {

    const [categoryName, setCategoryName] = useState("");
    const queryClient = useQueryClient();

    async function addCategory() {
        try {
            if (categoryName.trim() !== "" && categoryName.length !== 0) {
                const response = await axios.post('/api/addCategory', { categoryName, creator })
                if (response.data?.data) {
                    onClose();
                } else {
                    toast.error("Failed to upload a category");
                    onClose();
                }
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category");
            onClose();
        }
    }

    const addCategoryMutation = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchedCategories'] });
        },
        onError: (error) => {
            toast.error("Failed to add category");
            console.error("Error:", error);
        }
    })

    const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addCategoryMutation.mutate();
    }
    if (!isVisible) return null;
    return (
        <section className='fixed inset-0 z-10 flex items-center justify-center pt-20 backdrop-blur-md'>
            <div className='w-[500px] relative flex items-center justify-center px-10 py-8 rounded-xl dark:bg-neutral-900/80 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={handelSubmit} className='flex items-center justify-center gap-5 flex-col min-w-full'>
                    <div className='text-end'>
                        <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                    </div>
                    <div className='w-full'>
                        <label>CUSTOM CATEGORY :</label>
                        <input type="text" className='text-black px-3 my-3 py-2 w-full rounded' placeholder='Custom Category Name' required onChange={(e) => setCategoryName(e.target.value)} />
                    </div>

                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {
                            addCategoryMutation.isPending ?
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