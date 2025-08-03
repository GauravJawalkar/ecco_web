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
        },
        location: {
            type: String,
            default: "On Earth"
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        launchedDate: {
            type: Date,
        },
        shippingPolicy: {
            type: String,
            default: "Free shipping over ₹999"
        },
        returnPolicy: {
            type: String,
            default: "30-day easy returns"
        },
        contact: {
            type: String,
            default: "Not provided"
        },
        socialMedia: {
            instagram: {
                type: String,
                default: "https://instagram.com"
            },
            facebook: {
                type: String,
                default: "https://facebook.com"
            },
            twitter: {
                type: String,
                default: "https://twitter.com"
            }
        },
        isOpen: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
)

storeSchema.pre('save', function (next) {
    if (this.isNew) {
        this.launchedDate = new Date();
    }
    next();
});

export const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);