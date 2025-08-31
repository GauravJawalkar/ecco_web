import { useUserStore } from "@/store/UserStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative w-full max-w-md p-8 bg-white shadow-lg dark:bg-neutral-900 rounded-xl">
                <button
                    type="reset"
                    className="absolute text-gray-500 top-4 right-4 hover:text-gray-700 dark:hover:text-white"
                    onClick={onClose}>
                    <X />
                </button>
                <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
                    Store Onboarding
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Store Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-sm border rounded outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
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
                            className="w-full px-3 py-2 text-sm border rounded outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                            value={storeDescription}
                            onChange={(e) => setStoreDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Store Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            onChange={(e) => setStoreImage(e.target.files?.[0] || null)}
                            required
                        />
                        {storeImage && (
                            <div className="flex items-center gap-2 mt-2">
                                <img
                                    src={URL.createObjectURL(storeImage)}
                                    alt="Store Preview"
                                    className="object-cover w-16 h-16 border rounded"
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{storeImage.name}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Store Cover Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            onChange={(e) => setStoreCoverImage(e.target.files?.[0] || null)}
                            required
                        />
                        {storeCoverImage && (
                            <div className="flex items-center gap-2 mt-2">
                                <img
                                    src={URL.createObjectURL(storeCoverImage)}
                                    alt="Cover Preview"
                                    className="object-cover w-32 h-16 border rounded"
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{storeCoverImage.name}</span>
                            </div>
                        )}
                    </div>
                    {createStoreMutation.isError && (
                        <div className="text-sm text-red-500">Something Went Wrong</div>
                    )}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white transition bg-green-600 rounded outline-none hover:bg-green-700"
                        disabled={createStoreMutation.isPending}
                    >
                        {createStoreMutation.isPending ? <Loader title="Creating..." /> : "Create Store"}
                    </button>
                </form>
            </div>
        </div >
    );
};

export default StoreOnboardingModal;