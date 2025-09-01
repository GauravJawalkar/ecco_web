import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";
import connectDB from "@/db/dbConfig";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(_: NextRequest) {
    await connectDB();
    console.log('Refresh token endpoint called');

    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            console.log('No refresh token found');
            return NextResponse.json(
                { error: "Refresh token missing" },
                { status: 401 }
            );
        }

        let decoded: any;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            console.log("Decoded Refresh Token ID:", decoded._id);
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError);
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
        }

        const user = await User.findById(decoded._id);

        if (!user) {
            console.log('User not found for refresh token');
            return NextResponse.json({ error: "User not found" }, { status: 403 });
        }

        if (user.refreshToken !== refreshToken) {
            console.log('Refresh token mismatch');
            return NextResponse.json({ error: "Refresh token does not match" }, { status: 403 });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'strict' as const : 'lax' as const,
            path: '/',
        };

        cookieStore.set('accessToken', newAccessToken, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 // 1 day
        });

        cookieStore.set('refreshToken', newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        console.log('Tokens refreshed successfully');
        return NextResponse.json({
            success: true,
            message: "Tokens refreshed successfully",
            data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
        }, { status: 200 });

    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { error: "Token refresh failed" },
            { status: 403 }
        );
    }
}