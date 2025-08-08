import { Wallet, CreditCard } from 'lucide-react';
import React from 'react';

interface OrderPaymentInfoProps {
    paymentMethod: string;
}

export const OrderPaymentInfo: React.FC<OrderPaymentInfoProps> = ({ paymentMethod }) => {
    return (
        <div className="p-3 bg-gray-50 dark:bg-neutral-700/30 rounded-lg">
            <h4 className="text-base font-medium text-gray-500 dark:text-gray-400">
                Payment Method
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white flex items-center text-sm">
                {paymentMethod === "COD" ? (
                    <>
                        <Wallet className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Cash on Delivery</span>
                    </>
                ) : (
                    <>
                        <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Online Payment</span>
                    </>
                )}
            </p>
        </div>
    );
};

export default OrderPaymentInfo;