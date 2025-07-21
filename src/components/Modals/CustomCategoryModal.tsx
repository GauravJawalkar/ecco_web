"use client"

import React, { useState } from 'react'
import { CircleX, X } from 'lucide-react'
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
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='relative w-full max-w-md p-8 bg-white shadow-lg dark:bg-neutral-800 rounded-xl'>
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <form onSubmit={handelSubmit} className='flex flex-col items-center justify-center min-w-full space-y-3 text-sm'>
                    <div className='w-full space-y-1'>
                        <label>CUSTOM CATEGORY :</label>
                        <input type="text" className='w-full px-3 py-2 text-black border rounded' placeholder='Custom Category Name' required onChange={(e) => setCategoryName(e.target.value)} />
                    </div>

                    <button type='submit' className='w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700 disabled:cursor-not-allowed'>
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