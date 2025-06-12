'use client'

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleX } from 'lucide-react'
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
        <section className='inset-0 fixed flex items-center justify-center backdrop-blur-md z-10 h-screen'>
            <div className='w-[500px] flex items-center justify-center px-10 py-8 rounded-xl dark:bg-white/5 bg-slate-600/5 backdrop-blur-md'>
                <form onSubmit={handelReviewPost} className='flex items-center justify-center space-y-2 flex-col min-w-full'>
                    <div className='text-end'>
                        <CircleX className='cursor-pointer h-8 w-8 ' onClick={onClose} />
                    </div>
                    <div className='w-full'>
                        <label>Review Title :</label>
                        <input type="text" className='text-black px-3 my-3 py-2 w-full rounded' placeholder='Enter Review Title' required onChange={(e) => { setTitle(e.target.value) }} />
                    </div>

                    <div className='w-full'>
                        <label>Review Description :</label>
                        <input type="text" className='text-black px-3 my-3 py-2 w-full rounded' placeholder='Enter Review Description' required onChange={(e) => { setContent(e.target.value) }} />
                    </div>

                    <div className='w-full'>
                        <label>Review Images :</label>
                        <input type="file" className='text-black bg-white px-3 my-3 py-2 w-full rounded' placeholder='Enter Review Description' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setImageOne(e.target.files?.[0] || null);
                        }} />
                        <input type="file" className='text-black bg-white px-3 my-3 py-2 w-full rounded' placeholder='Enter Review Description' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setImageTwo(e.target.files?.[0] || null);
                        }} />
                        <input type="file" className='text-black bg-white px-3 my-3 py-2 w-full rounded' placeholder='Enter Review Description' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setImageThree(e.target.files?.[0] || null);
                        }} />
                    </div>

                    <button type='submit' className='w-full bg-[#0a0a0a] text-[#ededed] py-2 rounded text-lg hover:bg-[#1a1a1a] transition-all ease-linear duration-200'>
                        {postReviewMutation.isPending ? <Loader title={'Adding...'} /> : "Add Review"}
                    </button>
                </form>
            </div >
        </section >
    )
}

export default ReviewModal