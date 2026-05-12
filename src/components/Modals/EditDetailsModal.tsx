"use client"
import React, { useEffect, useState } from 'react'
import Loader from '../Loaders/Loader'
import { CircleX, X } from 'lucide-react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/UserStore';
import Image from 'next/image';
import ApiClient from '@/interceptors/ApiClient';

interface editDetailsProps {
    onClose: () => void;
    oldName: string;
    oldDescripion: string;
    oldPrice: string;
    oldDiscount: string;
    oldStock: string;
    oldSize: string;
    oldCategory: string;
    oldContainer: string;
    isVisible: boolean;
    oldImages: String[];
    id: string;
}

const EditDetailsModal = ({ isVisible, onClose, oldName, oldDescripion,
    oldPrice, oldDiscount, oldSize, oldCategory, oldStock, id, oldContainer, oldImages }: editDetailsProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const { data }: any = useUserStore();
    const [discount, setDiscount] = useState("");
    const [size, setSize] = useState("");
    const [container, setContainer] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const queryClient = useQueryClient();
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [secondImage, setSecondImage] = useState<File | null>(null);
    const [thirdImage, setThirdImage] = useState<File | null>(null);

    async function editProductDetails() {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('size', size);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('container', container);
        if (mainImage) {
            formData.append('mainImage', mainImage)
        } else {
            formData.append('mainImage', oldImages?.[0].toString())
        }
        if (secondImage) {
            formData.append('secondImage', secondImage)
        } else {
            formData.append('secondImage', oldImages?.[1].toString())
        }
        if (thirdImage) {
            formData.append('thirdImage', thirdImage)
        } else {
            formData.append('thirdImage', oldImages?.[2].toString())
        }

        try {
            const response = await ApiClient.put('/api/editProductDetails', formData);
            if (response.data.data) {
                return response.data.data || [];
            } else {
                toast.error("Failed to update")
                console.error("Error updating the details");
                return [];
            }
        } catch (error) {
            console.error("Error updating details : ", error)
            toast.error("Failed to update")
        }
    }

    const editProductDetailsMutation = useMutation(
        {
            mutationKey: ['eidtProductDetails'],
            mutationFn: editProductDetails,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['sellerProducts', data?._id] });
                onClose();
            },
            onError: (error) => {
                toast.error("Failed to update");
                console.error("Error updating details : ", error);
            }
        }
    )

    const handelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (size === "Select Size") {
            toast.error("Please select a valid size.");
            return;
        }
        if (container === "Select Container") {
            toast.error("Please select a valid container.");
            return;
        }
        if (category === "Select Category") {
            toast.error("Please select a valid category.");
            return;
        }
        editProductDetailsMutation.mutate();
    }

    const getPreviewUrl = (file: File | null) => file ? URL.createObjectURL(file) : null;

    async function getCategories() {
        try {
            const response = await ApiClient.get('/api/getCategories')
            if (response.data.data) {
                return response.data.data
            } else {
                return [];
            }
        } catch (error) {
            console.log("Error fetching the categories : ", error);
            return [];
        }
    }

    useEffect(() => {
        setName(oldName);
        setDescription(oldDescripion);
        setPrice(oldPrice);
        setDiscount(oldDiscount);
        setCategory(oldCategory);
        setSize(oldSize);
        setContainer(oldContainer);
        setStock(oldStock);
    }, [oldName, oldDescripion, oldPrice, oldSize, oldPrice, id, oldStock, oldCategory, oldContainer])

    const { data: fetchedCategories = [] } = useQuery({
        queryKey: ['fetchedCategories'],
        queryFn: getCategories
    })

    useEffect(() => {
        if (!isVisible) {
            setMainImage(null);
            setSecondImage(null);
            setThirdImage(null);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50 bg-[#0a0a0a]/40 backdrop-blur-sm transition-opacity" 
                onClick={() => onClose()}
                aria-hidden="true"
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white dark:bg-[#1a1a1a] shadow-2xl border-l border-gray-200 dark:border-neutral-800 sm:max-w-lg lg:max-w-xl animate-in slide-in-from-right duration-300">
                
                {/* Header (Sticky) */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60 bg-white/95 dark:bg-[#1a1a1a] backdrop-blur z-10 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Edit Product Details</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Update the details for this listing.</p>
                    </div>
                    <button 
                        onClick={() => onClose()} 
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 outline-none" 
                        aria-label="Close panel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body (Scrollable) */}
                <form id="edit-product-form" onSubmit={handelSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    
                    {/* Basic Info Section */}
                    <div className="space-y-5">
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Basic Details</h3>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Product Name</label>
                            <input 
                                type="text" 
                                value={name}
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
                                value={description}
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
                                    value={category}
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none cursor-pointer" 
                                    required 
                                    onChange={(e) => setCategory(e.target.value)} 
                                >
                                    <option value="" className="dark:bg-neutral-900">Select Category</option>
                                    {fetchedCategories.length !== 0 && fetchedCategories.map(({ categoryName, _id }: { categoryName: string, _id: string }) => (
                                        <option key={_id} value={categoryName} className="dark:bg-neutral-900 capitalize">{categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Container</label>
                                <select 
                                    value={container}
                                    onChange={(e) => setContainer(e.target.value)} 
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none cursor-pointer"
                                >
                                    <option value="" className="dark:bg-neutral-900">Select Container</option>
                                    <option value="Growth Bag" className="dark:bg-neutral-900">Growth Bag</option>
                                    <option value="Pot" className="dark:bg-neutral-900">Pot</option>
                                    <option value="Box" className="dark:bg-neutral-900">Box</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Size</label>
                                <select 
                                    value={size}
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
                                    value={stock}
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
                                        value={price}
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
                                        value={discount}
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMainImage(e.target.files?.[0] || null)} 
                                    />
                                    <Image 
                                        src={mainImage ? getPreviewUrl(mainImage)! : `${oldImages?.[0]}`} 
                                        fill 
                                        alt="Preview" 
                                        className="object-cover group-hover:opacity-60 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                        <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                    </div>
                                </div>
                            </div>

                            {/* Second Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Image 2</label>
                                <div className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecondImage(e.target.files?.[0] || null)} 
                                    />
                                    <Image 
                                        src={secondImage ? getPreviewUrl(secondImage)! : `${oldImages?.[1]}`} 
                                        fill 
                                        alt="Preview" 
                                        className="object-cover group-hover:opacity-60 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                        <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                        <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                    </div>
                                </div>
                            </div>

                            {/* Third Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Image 3</label>
                                <div className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThirdImage(e.target.files?.[0] || null)} 
                                    />
                                    <Image 
                                        src={thirdImage ? getPreviewUrl(thirdImage)! : `${oldImages?.[2]}`} 
                                        fill 
                                        alt="Preview" 
                                        className="object-cover group-hover:opacity-60 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                        <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                        <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>

                {/* Footer (Sticky) */}
                <div className="border-t border-gray-100 dark:border-neutral-800/60 bg-gray-50 dark:bg-neutral-900/50 px-6 py-4 shrink-0 flex items-center justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={() => onClose()} 
                        className="px-4 h-10 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="edit-product-form"
                        className="px-6 h-10 bg-green-700 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-green-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={editProductDetailsMutation.isPending}
                    >
                        {editProductDetailsMutation.isPending ? <Loader title='Updating' /> : "Update Details"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default EditDetailsModal