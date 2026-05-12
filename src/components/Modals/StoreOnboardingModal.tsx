import { useUserStore } from "@/store/UserStore";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loaders/Loader";
import ApiClient from "@/interceptors/ApiClient";

interface StoreOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: FormData) => void; // You can adjust this as needed
    ownerId: string;
}

const StoreOnboardingModal: React.FC<StoreOnboardingModalProps> = ({ isOpen, onClose, ownerId }) => {
    const [storeName, setStoreName] = useState("");
    const [storeDescription, setStoreDescription] = useState("");
    const [storeImage, setStoreImage] = useState<File | null>(null);
    const [storeCoverImage, setStoreCoverImage] = useState<File | null>(null);
    const setUser = useUserStore((state) => state.setUser)

    async function createStore() {
        try {
            if (!storeName || !storeDescription || !storeImage || !storeCoverImage) {
                return toast.error("All fields are required.");
            }
            const formData = new FormData();
            formData.append("storeName", storeName);
            formData.append("storeDescription", storeDescription);
            formData.append("storeImage", storeImage);
            formData.append("storeCoverImage", storeCoverImage);
            formData.append("owner", ownerId);

            const response = await ApiClient.post("/api/createStore", formData);

            if (response.status === 201) {
                toast.success("Store created successfully!");
                if (response?.data?.storeStatus) {
                    setUser(response.data?.storeStatus);
                }
                onClose();
            }
        } catch (error) {
            console.error("Error creating store:", error);
            toast.error("Failed to create store. Please try again.");
        }

    }

    const createStoreMutation = useMutation(
        {
            mutationFn: createStore,
            onSuccess: () => {
                toast.success("Store created !");
                onClose();
            },
            onError: (error) => {
                console.error("Error creating store:", error);
                toast.error("Failed to create store. Please try again.");
            },
        }
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        createStoreMutation.mutate();
    };

    // Reset form fields when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setStoreCoverImage(null);
            setStoreImage(null);
            setStoreName("");
            setStoreDescription("");
        }
    }, [isOpen])

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
            <div className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white dark:bg-[#1a1a1a] shadow-2xl border-l border-gray-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">

                {/* Header (Sticky) */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800/60 bg-white/95 dark:bg-[#1a1a1a] backdrop-blur z-10 shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Create Your Store</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Let's set up your brand profile.</p>
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
                <form id="store-onboarding-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Store Name</label>
                        <input
                            type="text"
                            className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none"
                            placeholder="My Awesome Store"
                            required
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Store Description</label>
                        <textarea
                            className="w-full rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm outline-none resize-none min-h-[100px]"
                            placeholder="What do you sell?"
                            required
                            value={storeDescription}
                            onChange={(e) => setStoreDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                        {/* Profile Image */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Profile Image</label>
                            <div className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => setStoreImage(e.target.files?.[0] || null)}
                                    required
                                />
                                {storeImage ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={URL.createObjectURL(storeImage)}
                                            alt="Profile Preview"
                                            className="w-full h-full object-contain p-2 group-hover:opacity-60 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                            <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500">
                                        <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] font-medium">Upload</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Cover Image</label>
                            <div className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer overflow-hidden group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => setStoreCoverImage(e.target.files?.[0] || null)}
                                    required
                                />
                                {storeCoverImage ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={URL.createObjectURL(storeCoverImage)}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/40 z-0">
                                            <span className="text-[10px] text-white font-medium drop-shadow-md">Change</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400 dark:text-neutral-500">
                                        <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] font-medium">Upload</span>
                                    </div>
                                )}
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
                        form="store-onboarding-form"
                        className="px-6 h-10 bg-green-700 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-green-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={createStoreMutation.isPending}
                    >
                        {createStoreMutation.isPending ? <Loader title='Creating...' /> : "Create Store"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default StoreOnboardingModal;