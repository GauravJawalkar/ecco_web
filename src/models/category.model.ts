import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.model('Category', categorySchema)
