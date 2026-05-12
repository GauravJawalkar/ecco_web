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
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-[#0a0a0a]/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white dark:bg-[#1a1a1a] shadow-2xl border-l border-gray-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">

                {/* Header (Sticky) */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60 bg-white/95 dark:bg-[#1a1a1a] backdrop-blur z-10 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Add Your Review</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Share your experience with this product.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 outline-none"
                        aria-label="Close panel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body (Scrollable) */}
                <form id="add-review-form" onSubmit={handelReviewPost} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Review Title</label>
                        <input
                            type="text"
                            className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                            placeholder="Sum up your experience"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Review Description</label>
                        <textarea
                            className="w-full rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none resize-none min-h-[120px]"
                            placeholder="What did you like or dislike? What should other buyers know?"
                            required
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Add Photos (Optional)</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { file: imageOne, setFile: setImageOne, label: "Photo 1" },
                                { file: imageTwo, setFile: setImageTwo, label: "Photo 2" },
                                { file: imageThree, setFile: setImageThree, label: "Photo 3" }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">{item.label}</label>
                                    <div className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={(e) => item.setFile(e.target.files?.[0] || null)}
                                        />
                                        {item.file ? (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={URL.createObjectURL(item.file)}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                                    <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500">
                                                <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                                <span className="text-[10px] font-medium">Add</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Footer (Sticky) */}
                <div className="border-t border-gray-100 dark:border-neutral-800/60 bg-gray-50 dark:bg-neutral-900/50 px-6 py-4 shrink-0 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 h-10 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-review-form"
                        className="px-6 h-10 bg-green-700 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-green-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={postReviewMutation.isPending}
                    >
                        {postReviewMutation.isPending ? <Loader title='Submitting...' /> : "Submit Review"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default ReviewModal