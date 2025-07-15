import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema(
    {
        storeName: {
            type: String,
            required: true,
            unique: true
        },
        storeDescription: {
            type: String,
            required: true
        },
        storeImage: {
            type: String,
            required: true
        },
        storeCoverImage: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
    }
)

export const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);