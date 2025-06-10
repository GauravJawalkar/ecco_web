import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        price: {
            type: Number,
            required: [true, "Price cant be empty"],
            trim: true,
        },
        discount: {
            type: Number,
            trim: true
        },
        stock: {
            type: Number,
            required: true,
        },
        images: [
            {
                type: String,
                required: true
            }
        ],
        rating: [
            {
                ratedBy: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                rateNumber: {
                    type: Number,
                    default: 0,
                    enum: [0, 1, 2, 3, 4, 5],
                    required: true
                }
            }
        ],
        size: {
            type: Number,
            required: true
        },
        category: {
            type: String,
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema)