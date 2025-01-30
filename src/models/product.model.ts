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
        prod_Images: [
            {
                type: String,
                required: true
            }
        ],
        size: {
            type: Number,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model('Product', productSchema)