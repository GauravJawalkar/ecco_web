import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required for authentication"],
            unique: true,
            trim: true
        },
        store: {
            type: Boolean,
            default: false,
        },
        storeDetails: {
            storeName: {
                type: String,
                default: ""
            },
            storeId: {
                type: String,
                default: ""
            }
        },
        password: {
            type: String,
            required: true
        },
        googleId: {
            type: String,
        },
        isSeller: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isSuperAdmin: {
            type: Boolean,
            default: false
        },
        bankDetails: {
            account_holder_name: {
                type: String,
                default: ""
            },
            account_number: {
                type: String,
                default: ""
            },
            ifsc: {
                type: String,
                default: ""
            },
            razorpayFundAccountId: {
                type: String,
                default: ""
            },
            razorpayAccountId: {
                type: String,
                default: ""
            },
            status: {
                type: String,
                default: "Pending",
                enum: ["Pending", "Verified"]
            }
        },
        avatar: {
            type: String
        },
        refreshToken: {
            type: String,
            default: null
        },
        forgotPasswordOTP: {
            type: String
        },
        forgotPasswordOTPexpiry: {
            type: Date,
        },
        emailVerificationOTP: {
            type: String,
        },
        emailVerificationOTPexpiry: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
)

// encrypt the password before saving into the database
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

// for password validation when user wants to login
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

// short term token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: '2m'
        }
    )
}

// longterm token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: '10d'
        }
    )

}

export const User = mongoose.models.User || mongoose.model("User", userSchema)