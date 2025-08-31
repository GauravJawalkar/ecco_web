import React, { useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Loader from '../Loaders/Loader'
import ApiClient from '@/interceptors/ApiClient'

interface DeleteProductModalProps {
    isOpen: boolean
    onClose: () => void
    productName?: string
    productId?: string
    sellerId?: string
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
    isOpen,
    onClose,
    productName,
    productId,
    sellerId
}) => {
    const queryClient = useQueryClient();

    async function deleteProduct() {
        try {
            const response = await ApiClient.delete("/api/deleteProduct", {
                data: { sellerId, productId },
            });
            if (response.data?.product) {
                return response.data?.product;
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
            onClose();
        },
        onError: () => {
            toast.error("Failed to delete the product.");
        },
    })

    const handelDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!productId || !sellerId) {
            console.error("Product ID and Seller ID are required for deletion.");
            return null;
        }
        deleteMutation.mutate();
    };

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-white/5 dark:bg-black/5">
            <div className="relative w-full max-w-md p-8 bg-white border dark:bg-neutral-900 rounded-xl dark:border-neutral-800">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                    onClick={onClose}
                    title='Close'
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                    <Trash2 className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white text-center">
                        Delete Product
                    </h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">
                        Are you sure you want to delete
                        <br />
                        <span className="font-semibold text-red-500">{productName}</span>
                        <br />
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-4 w-full">
                        <button
                            className="flex-1 py-2 rounded bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-neutral-700 transition"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="flex-1 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                            onClick={handelDelete}
                        >
                            {deleteMutation.isPending ? <Loader title='Deleting...' /> : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteProductModal