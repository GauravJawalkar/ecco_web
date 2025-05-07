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
                    default: 1,
                    min: 1
                },
                discount: {
                    type: Number,
                    required: true,
                },
                sellerName: {
                    type: String,
                }
            }
        ],
        cartSubTotal: {
            type: Number,
            default: 0,
            required: true
        }
    },
    {
        timestamps: true
    }
)

cartSchema.pre('save', async function (next) {
    this.cartSubTotal = await this.cartItems.reduce((total, item) => {
        return (total + ((item.price - item.discount) * item.quantity));
    }, 0);
    next();
});

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema)
