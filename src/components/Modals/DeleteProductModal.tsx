import { X, Trash2 } from 'lucide-react'
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
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Delete Product</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Remove this product from your catalog.</p>
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

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 mb-6 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-100 dark:border-red-500/20">
                        <Trash2 className="w-8 h-8 text-red-600 dark:text-red-500" strokeWidth={1.5} />
                    </div>
                    
                    <p className="text-[15px] leading-relaxed text-gray-700 dark:text-neutral-300">
                        Are you sure you want to permanently delete
                    </p>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white mt-1 mb-3 capitalize">
                        {productName}?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                        This action cannot be undone. All data associated with this product will be lost.
                    </p>
                </div>

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
                        type="button" 
                        onClick={handelDelete}
                        className="px-6 h-10 bg-red-600 dark:bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? <Loader title='Deleting...' /> : "Delete Product"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default DeleteProductModal