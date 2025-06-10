import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema(
    {
        productID: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        rating: {
            type: Number,
            default: 0,
            enum: [0, 1, 2, 3, 4, 5],
            required: true
        }
    }
)

export const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema)