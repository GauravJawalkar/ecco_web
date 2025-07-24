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
        storeDetails: {
            storeName: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
            },
            storeId: {
                type: Schema.Types.ObjectId,
                ref: "Store",
                required: true
            }
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
            type: String,
            enum: ['Small', 'Medium', 'Large '],
            required: true
        },
        containerType: {
            type: String,
            enum: ['Growth Bag', 'Pot'],
            required: true
        },
        category: {
            type: String,
            required: true
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema)