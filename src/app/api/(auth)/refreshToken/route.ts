import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import connectDB from "@/db/dbConfig";

export async function POST(request: NextRequest) {
    await connectDB();
    console.log('Refresh token endpoint called');
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: "Refresh token missing" },
                { status: 401 }
            );
        }

        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        console.log("Decoded Refresh Token is : ", decoded);
        const user = await User.findById(decoded?._id);

        if (!user || user?.refreshToken !== refreshToken) {
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        // Set development-friendly cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production'
                ? 'strict' as const : 'lax' as const,
            path: '/',
        };

        cookieStore.set('accessToken', newAccessToken, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60
        });

        cookieStore.set('refreshToken', newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60
        });

        return NextResponse.json({ success: true, message: "Tokens refreshed successfully" }, { status: 200 });
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { error: "Token refresh failed" },
            { status: 403 }
        );
    }
}