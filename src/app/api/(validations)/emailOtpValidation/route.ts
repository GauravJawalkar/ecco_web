import connectDB from "@/db/dbConfig";
import { mailValidator } from "@/helpers/mailValidation";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { _id, email } = reqBody;


        if (_id.trim() === "") {
            return NextResponse.json({ error: "Enter correct email" }, { status: 402 })
        }

        const user = await User.findOne({ _id });

        if (!user) {
            return NextResponse.json({ error: "No such email found in the database" }, { status: 400 })
        }

        const validationOTP = await mailValidator({ email: email, emailType: "verifyEmail" });

        if (!validationOTP) {
            return NextResponse.json({ error: "Failed to send the OTP for credentials" }, { status: 401 })
        }

        return NextResponse.json({ data: validationOTP }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}