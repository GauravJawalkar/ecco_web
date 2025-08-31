import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-neutral-900">
                <button
                    onClick={onClose}
                    className="absolute p-1 text-gray-500 rounded-full top-4 right-4 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
                    {showAdditionalFields ? "Additional Store Details" : "Basic Store Details"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!showAdditionalFields ? (
                        <>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Store Name *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Store Description *
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                    value={storeDescription}
                                    onChange={(e) => setStoreDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Profile Image *
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-xs border dark:border-neutral-700 p-2 rounded-lg file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setStoreImage(e.target.files?.[0] || null)}
                                    />
                                    <div className="relative w-16 h-16 overflow-hidden border rounded-full dark:border-neutral-700">
                                        <Image
                                            src={storeImage ? URL.createObjectURL(storeImage) : store.storeImage}
                                            alt="Profile Preview"
                                            height={200}
                                            width={200}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Cover Image *
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-xs border dark:border-neutral-700 p-2 rounded-lg file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        onChange={(e) => setStoreCoverImage(e.target.files?.[0] || null)}
                                    />
                                    <div className="relative w-1/3 h-16 overflow-hidden border rounded-md dark:border-neutral-700">
                                        <Image
                                            src={storeCoverImage ? URL.createObjectURL(storeCoverImage) : store.storeCoverImage}
                                            alt="Cover Preview"
                                            height={200}
                                            width={200}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAdditionalFields(true)}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Add More Details <ChevronRight className="w-4 h-4 ml-1" />
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Save Basic Info
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Shipping Policy
                                    </label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                        value={shippingPolicy}
                                        onChange={(e) => setShippingPolicy(e.target.value)}
                                        placeholder="Enter your shipping policy"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Return Policy
                                    </label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                        value={returnPolicy}
                                        onChange={(e) => setReturnPolicy(e.target.value)}
                                        placeholder="Enter your return policy"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        placeholder="+91"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Social Media Links
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 dark:text-gray-400"><Instagram /></span>
                                        <input
                                            type="text"
                                            className="flex-1 px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                            value={instagram}
                                            onChange={(e) => setInstagram(e.target.value)}
                                            placeholder="Instagram Link"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 dark:text-gray-400"><Facebook /></span>
                                        <input
                                            type="text"
                                            className="flex-1 px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                            value={facebook}
                                            onChange={(e) => setFacebook(e.target.value)}
                                            placeholder="Facebook Link"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 dark:text-gray-400"><Twitter /></span>
                                        <input
                                            type="text"
                                            className="flex-1 px-3 py-2 text-sm border rounded-md dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                            value={twitter}
                                            onChange={(e) => setTwitter(e.target.value)}
                                            placeholder="Twitter Link"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={isStoreOpen}
                                            onChange={(e) => setIsStoreOpen(e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Store is currently open
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAdditionalFields(false)}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-70"
                                        disabled={updateDetailsMutation.isPending}
                                    >
                                        {updateDetailsMutation.isPending ? (
                                            <Loader title="Saving..." />
                                        ) : "Save All Changes"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditStoreDetailsModal;