import mongoose, { Schema } from "mongoose";

const specialAppearenceSchema = new Schema(
    {
        prodName: {
            type: String,
            required: true
        },
        prodDesc: {
            type: String,
            required: true
        },
        prodPrice: {
            type: String,
            required: true
        },
        prodImages: [
            {
                type: String,
                required: true
            }
        ],
        prodDiscount: {
            type: Number,
            required: true
        },
        setActive: {
            type: Boolean,
            default: false,
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        requestedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sellerName: {
            type: String,
            required: true
        },
        isSellerVerified: {
            type: Boolean,
            required: true
        },
        sellerAvatar: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const SpecialAppearence = mongoose.models.SpecialAppearence || mongoose.model("SpecialAppearence", specialAppearenceSchema)