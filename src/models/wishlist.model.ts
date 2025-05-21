import mongoose, { Schema } from "mongoose";

const wishListSchema = new Schema(
    {
        wishListOwner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        wishListItems: [
            {
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                images: {
                    type: String,
                    required: true
                },
                seller: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                }
            }
        ]
    }
)

export const WishList = mongoose.models.WishList || mongoose.model("WishList", wishListSchema);