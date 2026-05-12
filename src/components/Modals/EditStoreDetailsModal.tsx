import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loaders/Loader";
import { X, ChevronRight, ChevronLeft, Instagram, Facebook, Twitter } from "lucide-react";
import ApiClient from "@/interceptors/ApiClient";

interface EditStoreDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: {
        _id: string;
        storeName: string;
        storeDescription: string;
        storeImage: string;
        storeCoverImage: string;
        shippingPolicy?: string;
        returnPolicy?: string;
        contact?: string;
        socialMedia: {
            instagram?: string,
            facebook?: string,
            twitter?: string,
        },
        isOpen?: boolean;
    };
}

const EditStoreDetailsModal: React.FC<EditStoreDetailsModalProps> = ({ isOpen, onClose, store }) => {
    // Basic fields
    const [storeName, setStoreName] = useState(store?.storeName);
    const [storeDescription, setStoreDescription] = useState(store?.storeDescription);
    const [storeImage, setStoreImage] = useState<File | null>(null);
    const [storeCoverImage, setStoreCoverImage] = useState<File | null>(null);

    // Additional fields
    const [shippingPolicy, setShippingPolicy] = useState(store?.shippingPolicy || "");
    const [returnPolicy, setReturnPolicy] = useState(store?.returnPolicy || "");
    const [contactPhone, setContactPhone] = useState(store?.contact || "");
    const [instagram, setInstagram] = useState(store?.socialMedia.instagram || "");
    const [facebook, setFacebook] = useState(store?.socialMedia.facebook || "");
    const [twitter, setTwitter] = useState(store?.socialMedia.twitter || "");
    const [isStoreOpen, setIsStoreOpen] = useState(store?.isOpen ?? true);

    // Form state
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const queryClient = useQueryClient();

    async function updateDetails() {
        try {
            const formData = new FormData();
            formData.append("storeId", store?._id);
            formData.append("storeName", storeName);
            formData.append("storeDescription", storeDescription);
            formData.append("shippingPolicy", shippingPolicy);
            formData.append("returnPolicy", returnPolicy);
            formData.append("contactPhone", contactPhone);
            formData.append("instagram", instagram);
            formData.append("facebook", facebook);
            formData.append("twitter", twitter);
            formData.append("isStoreOpen", String(isStoreOpen));

            if (storeImage) {
                formData.append("storeImage", storeImage);
            } else {
                formData.append("storeImage", store.storeImage);
            }

            if (storeCoverImage) {
                formData.append("storeCoverImage", storeCoverImage);
            } else {
                formData.append("storeCoverImage", store.storeCoverImage);
            }

            const response = await ApiClient.put("/api/updateStore", formData);
            if (response?.data?.data) {
                toast.success("Store details updated successfully");
                onClose();
            }
        } catch (error) {
            console.error("Error updating store details:", error);
            toast.error("Failed to update store details");
        }
    }

    const updateDetailsMutation = useMutation({
        mutationFn: updateDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['StoreData'] });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        updateDetailsMutation.mutate();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-50 bg-[#0a0a0a]/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white dark:bg-[#1a1a1a] shadow-2xl border-l border-gray-200 dark:border-neutral-800 sm:max-w-lg lg:max-w-xl animate-in slide-in-from-right duration-300">
                
                {/* Header (Sticky) */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60 bg-white/95 dark:bg-[#1a1a1a] backdrop-blur z-10 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Edit Store Details</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Manage your store's public profile and policies.</p>
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
                <form id="edit-store-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    
                    {/* Basic Info Section */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Basic Information</h3>
                            <label className="flex items-center cursor-pointer">
                                <span className="mr-3 text-sm font-medium text-gray-700 dark:text-neutral-300">
                                    {isStoreOpen ? "Store Open" : "Store Closed"}
                                </span>
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={isStoreOpen} onChange={(e) => setIsStoreOpen(e.target.checked)} />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${isStoreOpen ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isStoreOpen ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                            </label>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Store Name</label>
                            <input 
                                type="text" 
                                value={storeName}
                                className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none" 
                                required 
                                onChange={(e) => setStoreName(e.target.value)} 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Store Description</label>
                            <textarea 
                                rows={3} 
                                value={storeDescription}
                                className="w-full rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none resize-none" 
                                required 
                                onChange={(e) => setStoreDescription(e.target.value)} 
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                            {/* Profile Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Profile Image</label>
                                <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={(e) => setStoreImage(e.target.files?.[0] || null)} 
                                    />
                                    <Image 
                                        src={storeImage ? URL.createObjectURL(storeImage) : store.storeImage} 
                                        fill 
                                        alt="Profile Preview" 
                                        className="object-contain p-2 group-hover:opacity-60 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                        <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Cover Image</label>
                                <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={(e) => setStoreCoverImage(e.target.files?.[0] || null)} 
                                    />
                                    <Image 
                                        src={storeCoverImage ? URL.createObjectURL(storeCoverImage) : store.storeCoverImage} 
                                        fill 
                                        alt="Cover Preview" 
                                        className="object-cover group-hover:opacity-60 transition-opacity" 
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                        <svg className="w-6 h-6 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-neutral-800" />

                    {/* Policies Section */}
                    <div className="space-y-5">
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Policies</h3>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Shipping Policy</label>
                            <textarea 
                                rows={2} 
                                value={shippingPolicy}
                                className="w-full rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none resize-none" 
                                placeholder="E.g. We ship within 2-3 business days." 
                                onChange={(e) => setShippingPolicy(e.target.value)} 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Return Policy</label>
                            <textarea 
                                rows={2} 
                                value={returnPolicy}
                                className="w-full rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none resize-none" 
                                placeholder="E.g. No returns for live plants." 
                                onChange={(e) => setReturnPolicy(e.target.value)} 
                            />
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-neutral-800" />

                    {/* Contact & Socials */}
                    <div className="space-y-5">
                        <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Contact & Social</h3>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Contact Phone</label>
                            <input 
                                type="tel" 
                                value={contactPhone}
                                className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none" 
                                placeholder="+91" 
                                onChange={(e) => setContactPhone(e.target.value)} 
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Instagram className="w-5 h-5" /></span>
                                <input 
                                    type="text" 
                                    value={instagram}
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent pl-10 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none" 
                                    placeholder="Instagram Handle or Link" 
                                    onChange={(e) => setInstagram(e.target.value)} 
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Facebook className="w-5 h-5" /></span>
                                <input 
                                    type="text" 
                                    value={facebook}
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent pl-10 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none" 
                                    placeholder="Facebook Handle or Link" 
                                    onChange={(e) => setFacebook(e.target.value)} 
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Twitter className="w-5 h-5" /></span>
                                <input 
                                    type="text" 
                                    value={twitter}
                                    className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent pl-10 pr-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none" 
                                    placeholder="Twitter/X Handle or Link" 
                                    onChange={(e) => setTwitter(e.target.value)} 
                                />
                            </div>
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
                        form="edit-store-form"
                        className="px-6 h-10 bg-green-700 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-green-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={updateDetailsMutation.isPending}
                    >
                        {updateDetailsMutation.isPending ? <Loader title='Saving...' /> : "Save Changes"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditStoreDetailsModal;