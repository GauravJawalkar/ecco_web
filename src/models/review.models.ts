import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        reviewedProduct: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        reviews: [
            {
                reviewedBy: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                reviewerName: {
                    type: String,
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                likes: {
                    type: Number,
                    default: 0
                },
                dislikes: {
                    type: Number,
                    default: 0
                }
            }
        ]
    }
);

export const Reviews = mongoose.models.Reviews || mongoose.model('Reviews', reviewSchema)