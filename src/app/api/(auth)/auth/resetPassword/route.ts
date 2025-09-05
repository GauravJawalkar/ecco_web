import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

connectDB();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { newPassword, OTP, email } = reqBody;

        if ([email, newPassword, OTP].some((field) => field.trim() === "")) {
            return NextResponse.json({ error: "All the fields are required" }, { status: 402 })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "No such user found in the database" }, { status: 404 })
        }

        const userOTP = user?.forgotPasswordOTP;

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        let updatedPassword;

        if (userOTP === OTP) {
            updatedPassword = await User.findOneAndUpdate(
                {
                    email
                },
                {
                    $set: {
                        password: hashedPassword,
                        forgotPasswordOTP: "",
                        forgotPasswordOTPexpiry: ""
                    }
                },
                {
                    returnDocument: 'after'
                }
            )
        } else {
            return NextResponse.json({ error: "Please Enter A valid OTP" }, { status: 400 })
        }

        return NextResponse.json({ data: updatedPassword }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to reset the password" }, { status: 500 })
    }
}