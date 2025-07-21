'use client'

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleX, X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../Loaders/Loader';

const ReviewModal = ({ onClose, isVisible, reviewedBy, reviewerName, reviewedProduct }: { onClose: () => void, isVisible: boolean, reviewedBy: string, reviewerName: string, reviewedProduct: string }) => {
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [imageOne, setImageOne] = useState<File | null>(null);
    const [imageTwo, setImageTwo] = useState<File | null>(null);
    const [imageThree, setImageThree] = useState<File | null>(null);
    const queryClient = useQueryClient();


    async function reviewProduct() {
        try {
            const formData = new FormData();
            formData.append('reviewedBy', reviewedBy);
            formData.append('reviewedProduct', reviewedProduct);
            formData.append('content', content);
            formData.append('reviewerName', reviewerName);
            if (imageOne) formData.append('imageOne', imageOne);
            if (imageTwo) formData.append('imageTwo', imageTwo);
            if (imageThree) formData.append('imageThree', imageThree);
            formData.append('title', title);
            const response = await axios.post('/api/review/addReview', formData);
            if (response.data.data) {
                toast.success("Review Added");
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error("Error posting review for the product : ", error);
            return [];
        }
    }

    const postReviewMutation = useMutation(
        {
            mutationFn: reviewProduct,
            onError: () => {
                toast.error("Something Went Wrong");
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['allReviews'] });
            },
            onSettled: () => {
                onClose();
            }
        }
    )

    const handelReviewPost = (e: React.FormEvent) => {
        e.preventDefault();
        postReviewMutation.mutate();
    }

    if (!isVisible) return null;
    return (
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='relative w-full max-w-md p-8 bg-white shadow-lg dark:bg-neutral-800 rounded-xl'>
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <form onSubmit={handelReviewPost} className='flex items-center justify-center space-y-2 flex-col min-w-full text-sm'>
                    <div className='w-full space-y-1'>
                        <label>Review Title :</label>
                        <input type="text" className='text-black px-3 py-2 w-full rounded border' placeholder='Enter Review Title' required onChange={(e) => { setTitle(e.target.value) }} />
                    </div>

                    <div className='w-full space-y-1'>
                        <label>Review Description :</label>
                        <input type="text" className='text-black px-3 py-2 w-full rounded border' placeholder='Enter Review Description' required onChange={(e) => { setContent(e.target.value) }} />
                    </div>

                    <div className='w-full space-y-1'>
                        <label>Review Images :</label>
                        <div className='space-y-4'>
                            <input type="file" className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer' placeholder='Enter Review Description' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setImageOne(e.target.files?.[0] || null);
                            }} />
                            <input type="file" className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer' placeholder='Enter Review Description' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setImageTwo(e.target.files?.[0] || null);
                            }} />
                            <input type="file" className='w-full text-black bg-white border dark:border-neutral-700 rounded file:px-3 file:py-2 file:border-0 file:bg-black/40 file:text-white file:mr-2 file:hover:cursor-pointer hover:cursor-pointer' placeholder='Enter Review Description' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setImageThree(e.target.files?.[0] || null);
                            }} />
                        </div>
                    </div>

                    <button type='submit' className='w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700 disabled:cursor-not-allowed'>
                        {postReviewMutation.isPending ? <Loader title={'Adding...'} /> : "Add Review"}
                    </button>
                </form>
            </div >
        </section >
    )
}

export default ReviewModal