import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        orderBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',

            required: true
        },
        orders: [
            {
                productId: [
                    {
                        type: String,
                        required: true
                    }
                ],
                orderName: {
                    type: String,
                    required: true
                },
                orderImage: {
                    type: String,
                    trim: true
                },
                contactNumber: {
                    type: Number,
                    min: 10,
                    required: true
                },
                orderPrice: {
                    type: Number,
                    required: true
                },
                pinCode: {
                    type: String,
                    required: true
                },
                landMark: {
                    type: String,
                    required: true
                },
                orderDiscount: {
                    type: Number,
                    required: true
                },
                orderQuantity: {
                    type: Number,
                    default: 1,
                    required: true
                },
                deliveryAddress: {
                    type: String,
                    required: true,
                },
                paymentMethod: {
                    type: String,
                    enum: ["Online", "COD"],
                    required: true
                },
                paymentStatus: {
                    type: String,
                    enum: ["Done", "Pending"],
                    required: true
                },
                orderDate: {
                    type: Date,
                    default: Date.now,
                    required: true
                },
                orderShippedDate: {
                    type: Date,
                    default: "No Dates As Of Now",
                    required: true
                },
                orderDeliveryDate: {
                    type: Date,
                    default: "No Dates As Of Now",
                    required: true
                },
                seller: [
                    {
                        productId: {
                            type: String,
                            required: true
                        },
                        sellerId: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                            required: true
                        }
                    }
                ],
                processingStatus: {
                    type: String,
                    enum: ['Order Confirmed', 'Order Shipped', 'Order Processing', 'Out For Delivery']
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);