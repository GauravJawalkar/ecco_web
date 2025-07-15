import connectDB from "@/db/dbConfig";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { User } from "@/models/user.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

connectDB()

export async function POST(request: NextRequest) {

    try {

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7)

        const reqBody = await request.json();

        const { email, password } = reqBody;

        if ([email, password].some((field) => field.trim() === "")) {
            return NextResponse.json({ error: "name email and password are required" }, { status: 404 })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 500 });
        }

        const validPassword = await user.isPasswordCorrect(password);

        if (!validPassword) {
            return NextResponse.json({ error: "Password incorret" }, { status: 400 })
        }

        const { accessToken, refreshToken }: any = await generateAccessAndRefreshToken(user._id)

        const loggedUser = await User.findById(user._id).select("-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry")

        if (!loggedUser) {
            return NextResponse.json({ error: "Cannot find logged user" }, { status: 402 })
        }

        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24,
        }

        const cookieStore = await cookies();
        cookieStore.set('accessToken', accessToken, options);
        cookieStore.set('refreshToken', refreshToken, options);

        return NextResponse.json(
            {
                user: loggedUser, accessToken, refreshToken,
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }

}