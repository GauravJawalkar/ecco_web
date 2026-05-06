'use client'

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleX, X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../Loaders/Loader';
import ApiClient from '@/interceptors/ApiClient';

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
            const response = await ApiClient.post('/api/review/addReview', formData);
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
        <section className='fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6'>
            <div className='relative w-full max-w-md p-6 sm:p-8 bg-white shadow-xl dark:bg-neutral-800 rounded-2xl max-h-[90vh] overflow-y-auto no-scrollbar'>
                <button title="close" className="absolute text-gray-500 top-4 right-4 sm:top-5 sm:right-5 hover:text-gray-700 dark:hover:text-white p-2 touch-manipulation" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <h2 className="mb-5 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-800 dark:text-white text-center">Add Your Review</h2>
                <form onSubmit={handelReviewPost} className='flex items-center justify-center space-y-4 sm:space-y-5 flex-col min-w-full text-sm sm:text-base'>
                    <div className='w-full space-y-1.5 sm:space-y-2'>
                        <label className="font-medium text-gray-700 dark:text-gray-300">Review Title</label>
                        <input type="text" className='text-black dark:text-white dark:bg-neutral-900 px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-lg border dark:border-neutral-700 outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]' placeholder='Enter Review Title' required onChange={(e) => { setTitle(e.target.value) }} />
                    </div>

                    <div className='w-full space-y-1.5 sm:space-y-2'>
                        <label className="font-medium text-gray-700 dark:text-gray-300">Review Description</label>
                        <textarea className='text-black dark:text-white dark:bg-neutral-900 px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-lg border dark:border-neutral-700 outline-none focus:ring-2 focus:ring-green-500 min-h-[80px] resize-none' placeholder='Enter Review Description' required onChange={(e) => { setContent(e.target.value) }} />
                    </div>

                    <div className='w-full space-y-1.5 sm:space-y-2'>
                        <label className="font-medium text-gray-700 dark:text-gray-300">Review Images</label>
                        <div className='space-y-3 sm:space-y-4'>
                            {[setImageOne, setImageTwo, setImageThree].map((setImage, idx) => (
                                <input key={idx} type="file" className='w-full text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 border dark:border-neutral-700 rounded-lg file:px-3 sm:file:px-4 file:py-2 sm:file:py-2.5 file:border-0 file:bg-gray-200 file:dark:bg-neutral-700 file:text-gray-700 file:dark:text-gray-200 file:mr-3 sm:file:mr-4 file:hover:cursor-pointer hover:cursor-pointer file:font-medium file:transition-colors min-h-[44px] flex items-center' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setImage(e.target.files?.[0] || null);
                                }} />
                            ))}
                        </div>
                    </div>

                    <button type='submit' className='w-full px-4 py-3 sm:py-3.5 mt-2 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation text-sm sm:text-base'>
                        {postReviewMutation.isPending ? <Loader title={'Adding...'} /> : "Submit Review"}
                    </button>
                </form>
            </div >
        </section >
    )
}

export default ReviewModal