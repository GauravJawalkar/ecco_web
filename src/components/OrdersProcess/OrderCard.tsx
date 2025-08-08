import { OrderItemType } from "@/app/(pages)/dashboard/ordersProcess/page";
import OrderCustomerInfo from "./OrderCustomerInfo";
import OrderPaymentInfo from "./OrderPaymentInfo";
import { OrderProductInfo } from "./OrderProductInfo";
import { OrderHeader } from "./OrderHeader";
import OrderTimeline from "./OrderTimeline";


interface OrderCardProps {
    order: OrderItemType;
    sellerName: string;
    showDetails: boolean;
    onShowDetails: () => void;
    onGenerateInvoice: () => void;
    onStatusUpdate: (status: string) => void;
}

export const OrderCard = ({
    order,
    sellerName,
    showDetails,
    onShowDetails,
    onGenerateInvoice,
    onStatusUpdate
}: OrderCardProps) => {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border dark:border-neutral-700 overflow-hidden">
            <OrderHeader
                orderId={order?._id}
                onShowDetails={onShowDetails}
                onGenerateInvoice={onGenerateInvoice}
                showDetails={showDetails}
            />

            {showDetails && (
                <div className="p-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <OrderProductInfo
                            name={order?.orderName}
                            image={order?.orderImage}
                            quantity={order?.orderQuantity}
                        />

                        <OrderCustomerInfo
                            contactNumber={order?.contactNumber}
                            pinCode={order?.pinCode}
                        />

                        <OrderPaymentInfo
                            paymentMethod={order?.paymentMethod}
                        />
                    </div>

                    <OrderTimeline
                        status={order?.processingStatus}
                        order={order}
                        onStatusUpdate={onStatusUpdate}
                    />
                </div>
            )}
        </div>
    );
};