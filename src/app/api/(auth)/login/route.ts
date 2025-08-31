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
            return NextResponse.json({ error: "name email and password are required" }, { status: 403 })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const validPassword = await user.isPasswordCorrect(password);

        if (!validPassword) {
            return NextResponse.json({ error: "Password incorret" }, { status: 400 })
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedUser = await User.findById(user._id).select("-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry")

        if (!loggedUser) {
            return NextResponse.json({ error: "Cannot find logged user" }, { status: 401 })
        }

        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production'
                ? 'strict' as const : 'lax' as const,
            maxAge: 24 * 60 * 60,
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production'
                ? 'strict' as const : 'lax' as const,
            maxAge: 7 * 24 * 60 * 60, // 7 days
        };

        const cookieStore = await cookies();
        cookieStore.set('accessToken', accessToken, accessTokenOptions);
        cookieStore.set('refreshToken', refreshToken, refreshTokenOptions);

        return NextResponse.json(
            {
                user: loggedUser, accessToken, refreshToken,
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 401 })
    }

}