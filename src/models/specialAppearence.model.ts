import mongoose, { Schema } from "mongoose";

const specialAppearenceSchema = new Schema(
    {
        prodName: {
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
        ]
    },
    {
        timestamps: true
    }
)

export const SpecialAppearence = mongoose.model("SpecialAppearence", specialAppearenceSchema)