import Image from "next/image";

interface OrderProductInfoProps {
    name: string;
    image: string;
    quantity: string;
}

export const OrderProductInfo = ({ name, image, quantity }: OrderProductInfoProps) => (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-neutral-700/30 rounded-lg">
        <div className="flex-shrink-0 bg-gray-200 rounded-xl dark:bg-neutral-800">
            <Image
                src={image || "/placeholder-product.jpg"}
                alt={name}
                width={80}
                height={80}
                className="rounded-md object-cover h-20 w-20"
            />
        </div>
        <div>
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 capitalize text-base">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Qty: {quantity}
            </p>
        </div>
    </div>
);