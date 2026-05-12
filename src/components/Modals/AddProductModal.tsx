"use client"
import { useUserStore } from '@/store/UserStore';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import Loader from '../Loaders/Loader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { userProps } from '@/interfaces/commonInterfaces';
import ApiClient from '@/interceptors/ApiClient';

const AddProductModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    const queryClient = useQueryClient();
    const { data }: { data: userProps } = useUserStore();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [size, setSize] = useState("");
    const [container, setContainer] = useState("")
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [primeImage, setPrimeImage] = useState<File | null>(null);
    const [secondImage, setSecondImage] = useState<File | null>(null);
    const [thirdImage, setThirdImage] = useState<File | null>(null);
    const storeName = data?.storeDetails?.storeName ?? "";
    const storeId = data?.storeDetails?.storeId ?? "";
    const sellerId = data?._id;

    async function addProduct() {
        if (size === "Select Size") {
            toast.success("Select Proper Size", { icon: "▄︻══━一💥" })
            return;
        }

        if (container === "Select Container") {
            toast.success("Select Proper Container", { icon: "▄︻══━一💥" })
            return;
        }
        try {
            const seller = data?._id;
            const formData = new FormData();
            formData.append('primeImage', primeImage as File);
            formData.append('secondImage', secondImage as File);
            formData.append('thirdImage', thirdImage as File);
            formData.append('name', name);
            formData.append('seller', seller);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('size', size);
            formData.append('container', container);
            formData.append('stock', stock);
            formData.append('stock', stock);
            formData.append('category', category);
            formData.append('storeName', storeName);
            formData.append('storeId', storeId);
            const response = await ApiClient.post('/api/addProduct', formData);
            if (response.data.data) {
                toast.success("Product Added Successfully");
                onClose();
                setPrimeImage(null);
                setSecondImage(null);
                setThirdImage(null);
                return response.data.data
            } else {
                toast.error('Error Adding Product')
            }
        } catch (error) {
            console.error("Error in adding the product", error);
        }
    }

    const mutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sellerProducts', sellerId],
            });
        },
    })

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate()
    }

    const getPreviewUrl = (file: File | null) => {
        if (!file) {
            return null;
        }
        return URL.createObjectURL(file);
    };

    async function getCategories() {
        try {
            const response = await ApiClient.get('/api/getCategories')
            if (response.data.data) {
                return response.data.data;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error fetching the categories : ", error);
            return [];
        }
    }

    const { data: exCategories = [] } = useQuery({
        queryKey: ['exCategories'],
        queryFn: getCategories,
        refetchOnWindowFocus: false,
    })

    const handleClose = () => {
        onClose();
        setPrimeImage(null);
        setSecondImage(null);
        setThirdImage(null);
    }

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-[#0a0a0a]/40 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white dark:bg-[#1a1a1a] shadow-2xl border-l border-gray-200 dark:border-neutral-800 sm:max-w-lg lg:max-w-xl animate-in slide-in-from-right duration-300">

                {/* Header (Sticky) */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60 bg-white/95 dark:bg-[#1a1a1a] backdrop-blur z-10 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Add Product</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Create a new listing in your store.</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 outline-none"
                        aria-label="Close panel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body (Scrollable) */}
                <form id="add-product-form" onSubmit={handelSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">

                    {/* Basic Info Section */}
                    <div className="space-y-5">
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Basic Details</h3>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Product Name</label>
                            <input
                                type="text"
                                className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                placeholder="e.g. Monstera Deliciosa"
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Description</label>
                            <textarea
                                rows={4}
                                className="w-full rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none resize-none"
                                placeholder="Describe the plant, its care requirements, etc."
                                required
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Category</label>
                                <select
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none cursor-pointer"
                                    required
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="" className="dark:bg-neutral-900">Select Category</option>
                                    {exCategories.length !== 0 && exCategories.map(({ categoryName, _id }: { categoryName: string, _id: string }) => (
                                        <option key={_id} value={categoryName} className="dark:bg-neutral-900">{categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Container</label>
                                <select
                                    onChange={(e) => setContainer(e.target.value)}
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none cursor-pointer"
                                >
                                    <option value="" className="dark:bg-neutral-900">Select Container</option>
                                    <option value="Growth Bag" className="dark:bg-neutral-900">Growth Bag</option>
                                    <option value="Pot" className="dark:bg-neutral-900">Pot</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Size</label>
                                <select
                                    onChange={(e) => setSize(e.target.value)}
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none cursor-pointer"
                                >
                                    <option value="" className="dark:bg-neutral-900">Select Size</option>
                                    <option value="Small" className="dark:bg-neutral-900">Small</option>
                                    <option value="Medium" className="dark:bg-neutral-900">Medium</option>
                                    <option value="Large" className="dark:bg-neutral-900">Large</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Stock</label>
                                <input
                                    type="number"
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                    placeholder="Available quantity"
                                    required
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-neutral-800" />

                    {/* Pricing Section */}
                    <div className="space-y-5">
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Pricing</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Selling Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent pl-7 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                        placeholder="0.00"
                                        required
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Discount</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent pl-3 pr-7 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                                        placeholder="0"
                                        required
                                        onChange={(e) => setDiscount(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-neutral-800" />

                    {/* Media Section */}
                    <div className="space-y-5">
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Media</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                            {/* Main Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Main Cover</label>
                                <div className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrimeImage(e.target.files?.[0] || null)}
                                    />
                                    {primeImage ? (
                                        <Image src={getPreviewUrl(primeImage) || ""} fill alt="Preview" className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-center px-2">
                                            <span className="text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                                                <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </span>
                                            <span className="text-[10px] text-gray-400">Upload Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Second Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Image 2</label>
                                <div className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecondImage(e.target.files?.[0] || null)}
                                    />
                                    {secondImage ? (
                                        <Image src={getPreviewUrl(secondImage) || ""} fill alt="Preview" className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-center px-2">
                                            <span className="text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                                                <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                            </span>
                                            <span className="text-[10px] text-gray-400">Upload Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Third Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Image 3</label>
                                <div className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        required
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThirdImage(e.target.files?.[0] || null)}
                                    />
                                    {thirdImage ? (
                                        <Image src={getPreviewUrl(thirdImage) || ""} fill alt="Preview" className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-center px-2">
                                            <span className="text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                                                <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                            </span>
                                            <span className="text-[10px] text-gray-400">Upload Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

                {/* Footer (Sticky) */}
                <div className="border-t border-gray-100 dark:border-neutral-800/60 bg-gray-50 dark:bg-neutral-900/50 px-6 py-4 shrink-0 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 h-10 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-product-form"
                        className="px-6 h-10 bg-green-700 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-green-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mutation?.isPending}
                    >
                        {mutation?.isPending ? <Loader title='Adding...' /> : "Add Product"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddProductModal