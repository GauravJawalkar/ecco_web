import mongoose, { Schema } from "mongoose";


const orderSchema = new Schema(
    {
        orderName: {
            type: String,
            required: true
        },
        orderImage: {
            type: String,
            trim: true
        },
        orderBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
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
            enum: ["Done", "COD"],
            required: true
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);