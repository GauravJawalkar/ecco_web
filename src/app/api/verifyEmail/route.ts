import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json();

        const { id, OTP } = reqBody;

        if (id.trim() === "" || OTP.trim() === "") {
            return NextResponse.json({ error: "Id and OTP fields are required" }, { status: 402 })
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ error: "User not found in the database" }, { status: 405 })
        }

        const validateEmailOTP = user?.emailVerificationOTP;

        console.log("validateEmailOTP : ", validateEmailOTP)

        if (validateEmailOTP === OTP) {
            await User.findByIdAndUpdate(
                id,
                {
                    $set: {
                        isEmailVerified: true,
                        emailVerificationOTP: "",
                        emailVerificationOTPexpiry: ""
                    }
                },
                {
                    new: true
                }
            )
        } else {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 401 })
        }

        return NextResponse.json({ data: "Email Verified Succcessfully" }, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Failed to verify the email" },
            { status: 500 }
        )
    }
}