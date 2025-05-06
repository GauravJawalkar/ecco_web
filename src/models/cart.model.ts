import mongoose, { Schema } from "mongoose";


const cartSchema = new Schema(
    {
        cartOwner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        cartItems: [
            {
                name: {
                    type: String,
                    trim: true,
                    required: true
                },
                price: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                },
                discount: {
                    type: Number,
                },
                sellerName: {
                    type: String,
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema)
