import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // Case 1: No refresh token — user is logged out
        if (!refreshToken || refreshToken.trim() === "") {
            return NextResponse.json(
                { error: "No refresh token - please login again" },
                { status: 403 }
            );
        }

        // Case 2: Validate refresh token
        let refreshPayload: JwtPayload;
        try {
            refreshPayload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as JwtPayload;
        } catch {
            // Refresh token expired/invalid
            return NextResponse.json(
                { error: "Refresh token expired - please login again" },
                { status: 403 }
            );
        }

        await connectDB();

        // Case 3: Access token is valid — return user immediately
        if (accessToken && accessToken.trim() !== "") {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET!
                ) as JwtPayload;

                const user = await User.findById(decoded._id)
                    .select("-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry")
                    .lean();

                if (user) {
                    return NextResponse.json(
                        { message: "User session valid", user },
                        { status: 200 }
                    );
                }
            } catch {
                // Access token invalid, proceed to refresh below
            }
        }

        // Case 4: Access token expired/missing but refresh is valid
        // AUTO-REFRESH the access token and return user
        const dbUser = await User.findById(refreshPayload._id);

        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }

        // Verify refresh token in database matches cookie
        if (dbUser.refreshToken !== refreshToken) {
            return NextResponse.json(
                { error: "Session invalid - please login again" },
                { status: 403 }
            );
        }

        // Step 5: Generate NEW tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(dbUser._id);

        // Step 6: Update refresh token in database
        try {
            await User.findByIdAndUpdate(dbUser._id, { refreshToken: newRefreshToken });
        } catch (error) {
            console.error('Failed to update refresh token in database:', error);
            return NextResponse.json(
                { error: "Failed to update tokens" },
                { status: 500 }
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

        // Step 7: Fetch fresh user data and return with new tokens in cookies
        const freshUser = await User.findById(dbUser._id)
            .select("-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry")
            .lean()
            .exec();

        const response = NextResponse.json(
            {
                message: "Session refreshed and user returned",
                user: freshUser
            },
            { status: 200 }
        );

        // Step 8: Set new tokens in cookies
        response.cookies.set('accessToken', newAccessToken, {
            ...cookieOptions,
            maxAge: 60 * 60 // 1 hour
        });

        response.cookies.set('refreshToken', newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error("Session check error:", error);
        return NextResponse.json(
            { error: "Session check failed" },
            { status: 500 }
        );
    }
}