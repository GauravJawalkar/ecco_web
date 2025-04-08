import mongoose, { Schema } from "mongoose";

const becomeSellerSchema = new Schema(
    {
        avatar: {
            type: String,
            required: true
        },
        sellerId: {
            type: String,
            required: true
        },
        isEmailVerified: {
            type: Boolean,
            required: true
        },
        email: {
            type: String,

        }
    },
    {
        timestamps: true
    }
)

export const BecomeSeller = mongoose.models.BecomeSeller || mongoose.model("BecomeSeller", becomeSellerSchema)