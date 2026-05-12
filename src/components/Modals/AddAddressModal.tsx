"use client"
import ApiClient from '@/interceptors/ApiClient';
import { useUserStore } from '@/store/UserStore';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CircleX, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface addressModalProps {
    onClose: () => void,
    isVisible: boolean
}

const AddAddressModal = ({ onClose, isVisible }: addressModalProps) => {
    const [address, setAddress] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [landMark, setLandMark] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const { data }: any = useUserStore();
    const queryClient = useQueryClient();

    async function addAddress() {
        try {
            const userId = data?._id
            const addressDetails = {
                address, pinCode, landMark, contactNumber, userId
            }
            const response = await ApiClient.post("/api/addAddress", { addressDetails });

            if (response.data.data) {
                return response.data.data
            }

            return []

        } catch (error) {
            console.error("Failed to Add the Address : ", error);
            return []
        }
    }

    const addAddressMutation = useMutation({
        mutationFn: addAddress,
        onSuccess: () => {
            toast.success("Address Added Successfully");
            queryClient.invalidateQueries({ queryKey: ['userAddresses'] })
        }
    })

    const handelAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        addAddressMutation.mutate();
        onClose();
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
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Add New Address</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Where should we deliver your plants?</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 outline-none"
                        aria-label="Close panel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body (Scrollable) */}
                <form id="add-address-form" onSubmit={handelAddress} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Full Address</label>
                            <textarea
                                rows={3}
                                className="w-full rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none resize-none"
                                placeholder="House/Flat No., Building Name, Street"
                                required
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">PIN Code</label>
                                <input
                                    type="text"
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                    placeholder="e.g. 400001"
                                    required
                                    onChange={(e) => setPinCode(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Landmark</label>
                                <input
                                    type="text"
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                    placeholder="Near local store"
                                    required
                                    onChange={(e) => setLandMark(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Contact Number</label>
                            <input
                                type="tel"
                                className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                placeholder="+91 9876543210"
                                required
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
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
                        form="add-address-form"
                        className="px-6 h-10 bg-green-700 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-green-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={addAddressMutation.isPending}
                    >
                        {addAddressMutation.isPending ? "Adding..." : "Add Address"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddAddressModal