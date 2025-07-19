import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loaders/Loader";
import { X } from "lucide-react";

interface EditStoreDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: {
        _id: string;
        storeName: string;
        storeDescription: string;
        storeImage: string; // URL
        storeCoverImage: string; // URL
    };
}

const EditStoreDetailsModal: React.FC<EditStoreDetailsModalProps> = ({ isOpen, onClose, store }) => {
    const [storeName, setStoreName] = useState(store?.storeName);
    const [storeDescription, setStoreDescription] = useState(store?.storeDescription);
    const [storeImage, setStoreImage] = useState<File | null>(null);
    const [storeCoverImage, setStoreCoverImage] = useState<File | null>(null);
    const profileImageUrl = store?.storeImage;
    const coverImageUrl = store?.storeCoverImage;
    const queryClient = useQueryClient();

    async function updateDetails() {
        try {
            const formData = new FormData();
            formData.append("storeId", store?._id);
            formData.append("storeName", storeName);
            formData.append("storeDescription", storeDescription);
            if (storeImage) {
                formData.append("storeImage", storeImage)
            } else {
                formData.append("storeImage", profileImageUrl);
            };
            if (storeCoverImage) {
                formData.append("storeCoverImage", storeCoverImage)
            } else {
                formData.append("storeCoverImage", coverImageUrl);
            };

            const response = await axios.put("/api/updateStore", formData);
            if (response?.data?.data) {
                toast.success("Details Updated");
                onClose();
            }
        } catch (error) {
            console.error("Error updating store details:", error);
            close();
        }
    }

    const updateDetailsMutation = useMutation({
        mutationFn: updateDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['StoreData'] });
            onClose();
        },
        onError: (error) => {
            toast.error("Failed to update store details");
            console.error("Error updating store details:", error);
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        updateDetailsMutation.mutate();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative w-full max-w-md p-8 bg-white shadow-lg dark:bg-neutral-900 rounded-xl">
                <button title="close" className="absolute text-2xl text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white" onClick={onClose} aria-label="Close" >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Edit Store Details</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Store Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Store Description
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border rounded dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                            value={storeDescription}
                            onChange={(e) => setStoreDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                            onChange={(e) => setStoreImage(e.target.files?.[0] || null)} />
                        <div className="flex items-center gap-2 mt-2">
                            <Image
                                src={storeImage ? URL.createObjectURL(storeImage) : store.storeImage}
                                alt="Profile Preview"
                                width={64}
                                height={64}
                                className="border rounded-full" />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cover Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:text-sm file:border-0 file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                            onChange={(e) => setStoreCoverImage(e.target.files?.[0] || null)} />
                        <div className="flex items-center gap-2 mt-2">
                            <Image
                                src={storeCoverImage ? URL.createObjectURL(storeCoverImage) : store.storeCoverImage}
                                alt="Cover Preview"
                                width={128}
                                height={48}
                                className="object-cover border rounded" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded hover:bg-green-700"
                        disabled={updateDetailsMutation.isPending}>
                        {updateDetailsMutation.isPending ? <Loader title="Updating..." /> : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditStoreDetailsModal;