import { Eye, EyeOff, FileText, Package } from "lucide-react";

interface OrderHeaderProps {
    orderId: string;
    showDetails: boolean;
    onShowDetails: () => void;
    onGenerateInvoice: () => void;
}

export const OrderHeader = ({ orderId, showDetails, onShowDetails, onGenerateInvoice }: OrderHeaderProps) => (
    <div className="dark:border-neutral-700 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Package className="h-5 w-5 text-green-500" />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                <p className="font-medium text-gray-900 dark:text-white">{orderId}</p>
            </div>
        </div>

        <div className="flex space-x-2">
            <button
                onClick={onGenerateInvoice}
                className="px-3 py-1.5 text-sm flex items-center space-x-1 border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            >
                <FileText className="h-4 w-4" />
                <span>Invoice</span>
            </button>
            <button
                onClick={onShowDetails}
                className="px-3 py-1.5 text-sm flex items-center space-x-1 border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
            >
                {showDetails ? (
                    <>
                        <EyeOff className="h-4 w-4" />
                        <span>Hide</span>
                    </>
                ) : (
                    <>
                        <Eye className="h-4 w-4" />
                        <span>Details</span>
                    </>
                )}
            </button>
        </div>
    </div>
);