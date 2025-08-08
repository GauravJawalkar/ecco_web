import { Phone, MapPin } from 'lucide-react';
import React from 'react';

interface OrderCustomerInfoProps {
    contactNumber: string;
    pinCode: string;
}

export const OrderCustomerInfo: React.FC<OrderCustomerInfoProps> = ({
    contactNumber,
    pinCode
}) => {
    return (
        <div className="p-3 bg-gray-50 dark:bg-neutral-700/30 rounded-lg">
            <h4 className="text-base font-medium text-gray-500 dark:text-gray-400">
                Customer Contact
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>+91 {contactNumber}</span>
            </p>
            <p className="mt-1 text-gray-900 dark:text-white flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Pincode: {pinCode}</span>
            </p>
        </div>
    );
};

export default OrderCustomerInfo;