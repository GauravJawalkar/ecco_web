import connectDB from "@/db/dbConfig";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_MAX_AGE = 15 * 60;          // 15 minutes — matches generateAccessToken
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days — matches generateRefreshToken

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        if (!email?.trim() || !password?.trim()) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const validPassword = await user.isPasswordCorrect(password);
        if (!validPassword) {
            return NextResponse.json({ error: "Password incorrect" }, { status: 400 });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const loggedUser = await User.findById(user._id).select(
            "-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry"
        );

        if (!loggedUser) {
            return NextResponse.json({ error: "Cannot find logged user" }, { status: 404 });
        }

        const isProd = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? ("strict" as const) : ("lax" as const),
            path: "/",
        };

        const response = NextResponse.json(
            { user: loggedUser, accessToken, refreshToken },
            { status: 200 }
        );

        response.cookies.set("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: ACCESS_MAX_AGE,
        });

        response.cookies.set("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: REFRESH_MAX_AGE,
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}