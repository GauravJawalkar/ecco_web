import connectDB from "@/db/dbConfig";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { User } from "@/models/user.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        if ([email, password].some((field) => field.trim() === "")) {
            return NextResponse.json(
                { error: "email and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const validPassword = await user.isPasswordCorrect(password);

        if (!validPassword) {
            return NextResponse.json(
                { error: "Password incorrect" },
                { status: 400 }
            );
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedUser = await User.findById(user._id)
            .select("-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry");

        if (!loggedUser) {
            return NextResponse.json(
                { error: "Cannot find logged user" },
                { status: 404 }
            );
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'strict' as const
                : 'lax' as const,
            path: '/',
        };

        // CREATE RESPONSE FIRST, then set cookies on it
        const response = NextResponse.json(
            {
                user: loggedUser,
                accessToken,
                refreshToken,
            },
            { status: 200 }
        );

        // Use response.cookies.set() — this actually sends Set-Cookie headers
        response.cookies.set('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60, // 1 day
        });

        response.cookies.set('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}