import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
