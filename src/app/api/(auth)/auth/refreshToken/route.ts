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

        // No refresh token - should logout
        if (!refreshToken || refreshToken.trim() === "") {
            console.log('No refresh token found');
            return NextResponse.json(
                { error: "No Refresh Token - Please Login" },
                { status: 403 }
            );
        }

        let decoded: any;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        } catch (jwtError) {
            // Invalid/expired refresh token - should logout
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
        }

        const user = await User.findById(decoded._id);

        if (!user) {
            // User doesn't exist - should logout
            return NextResponse.json({ error: "User not found" }, { status: 403 });
        }

        if (user?.refreshToken !== refreshToken) {
            // Token mismatch - security issue, should logout
            return NextResponse.json({ error: "Refresh token does not match" }, { status: 403 });
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        // Updating user's refresh token in database
        try {
            await User.findByIdAndUpdate(user?._id, { refreshToken: newRefreshToken });
        } catch (error) {
            console.error('Failed to update refresh token in database:', error);
            return NextResponse.json({ error: "Failed to update tokens" }, { status: 500 })
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'strict' as const : 'lax' as const,
            path: '/',
        };

        // Set cookies with correct expiration times
        cookieStore.set('accessToken', newAccessToken, {
            ...cookieOptions,
            maxAge: 60 * 60 // 1 hour
        });

        cookieStore.set('refreshToken', newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return NextResponse.json({
            success: true,
            message: "Tokens refreshed successfully"
        }, { status: 200 });

    } catch (error) {
        console.error('Unexpected refresh token error:', error);
        return NextResponse.json(
            { error: "Token refresh failed" },
            { status: 500 }
        );
    }
}