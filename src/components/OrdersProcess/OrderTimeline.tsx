import React from 'react';
import {
    Check,
    ArrowRight,
    Truck,
    PackageCheck,
    Package,
    Clock
} from 'lucide-react';

interface OrderTimelineProps {
    status: string;
    order: any;
    onStatusUpdate: (status: string) => void;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({
    status,
    order,
    onStatusUpdate
}) => {
    const timelineSteps = [
        {
            id: 1,
            statusKey: 'confirmed',
            title: 'Order Confirmed',
            description: 'Your order has been confirmed and is being prepared',
            icon: <Check className="h-5 w-5" />,
            action: null,
            completedStatus: (status: string) => status !== "Pending",
            showTime: order.orderDate,
            additionalInfo: null,
            showAction: (currentStatus: string) => false // Never show action for confirmed
        },
        {
            id: 2,
            statusKey: 'processing',
            title: 'Order Processing',
            description: (status: string) =>
                ["Order Processing", "Order Shipped", "Out For Delivery"].includes(status)
                    ? "Items are being prepared for shipment"
                    : "Waiting to begin processing",
            icon: <ArrowRight className="h-5 w-5" />,
            action: "Processing",
            completedStatus: (status: string) =>
                ["Order Processing", "Order Shipped", "Out For Delivery"].includes(status),
            showTime: order.orderDate,
            additionalInfo: null,
            showAction: (currentStatus: string) =>
                currentStatus === "Pending" || currentStatus === "Order Confirmed"
        },
        {
            id: 3,
            statusKey: 'shipped',
            title: 'Order Shipped',
            description: (status: string) =>
                ["Order Shipped", "Out For Delivery"].includes(status)
                    ? "Package has left our facility"
                    : "Will ship after processing",
            icon: <Truck className="h-5 w-5" />,
            action: "Ship",
            completedStatus: (status: string) =>
                ["Order Shipped", "Out For Delivery"].includes(status),
            showTime: order.orderDate,
            additionalInfo: (order: any) => order.trackingNumber && (
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <Package className="h-5 w-5" />
                    Tracking #: {order.trackingNumber}
                </div>
            ),
            showAction: (currentStatus: string) =>
                currentStatus === "Order Processing"
        },
        {
            id: 4,
            statusKey: 'delivery',
            title: 'Out for Delivery',
            description: (status: string) =>
                status === "Out For Delivery"
                    ? "Your package is with the delivery courier"
                    : "Will be dispatched for delivery soon",
            icon: <PackageCheck className="h-5 w-5" />,
            action: "Deliver",
            completedStatus: (status: string) => status === "Out For Delivery",
            showTime: order?.orderDate,
            additionalInfo: (order: any) => (
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-2" />
                    Estimated delivery: {order.estimatedDelivery || "Today"}
                </div>
            ),
            showAction: (currentStatus: string) =>
                currentStatus === "Order Shipped"
        }
    ];
    return (
        <div className="relative">
            {/* Vertical timeline connector */}
            <div className="absolute left-6 h-full w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-gray-200 dark:from-neutral-700 dark:via-neutral-700 dark:to-neutral-700 top-0 -z-10" />

            <div className="space-y-6">
                {timelineSteps.map((step) => {
                    const isCompleted = step.completedStatus(status);
                    const shouldShowAction = !isCompleted && step.showAction(status);

                    return (
                        <div key={step.id} className="flex items-start group">
                            {/* Status indicator circle */}
                            <div className={`relative flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${isCompleted
                                ? "bg-green-500 text-white ring-4 ring-green-200 dark:ring-green-900/30"
                                : "bg-gray-200 dark:bg-neutral-800 text-gray-400 border-2 border-gray-300 dark:border-neutral-600"
                                }`}>
                                {isCompleted ? step.icon : <span className="text-sm font-medium">{step.id}</span>}
                            </div>

                            {/* Timeline content */}
                            <div className="ml-5 flex-1 pt-1">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-base font-medium ${isCompleted ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                                        }`}>
                                        {step.title}
                                    </h3>
                                    {isCompleted && step.showTime && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(step.showTime).toLocaleTimeString()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-start justify-between mt-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {typeof step.description === 'function'
                                            ? step.description(status)
                                            : step.description}
                                    </p>

                                    {shouldShowAction && step.action && (
                                        <button
                                            onClick={() => onStatusUpdate(step.action)}
                                            className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center"
                                        >
                                            {step.icon}
                                            <span className="ml-1">Mark as {step.title}</span>
                                        </button>
                                    )}
                                </div>

                                {/* Additional step-specific information */}
                                {isCompleted && step.additionalInfo && step.additionalInfo(order)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTimeline;