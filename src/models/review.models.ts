import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: Number
        },
        dislikes: {
            type: Number
        },
        reviewedProduct: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    }
);

export const Reviews = mongoose.models.Reviews || mongoose.model('Reviews', reviewSchema)