import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        addresses: [
            {
                mainAddress: {
                    type: String,
                    required: true
                },
                pinCode: {
                    type: String,
                    required: true
                },
                landMark: {
                    type: String,
                    required: true
                },
                contactNumber: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
)

export const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);