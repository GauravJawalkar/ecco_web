import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value?.trim();
        const refreshToken = cookieStore.get("refreshToken")?.value?.trim();

        // No refresh token — fully logged out
        if (!refreshToken) {
            return NextResponse.json(
                { error: "No refresh token - please login again" },
                { status: 403 }
            );
        }

        // Verify refresh token is valid (not expired, not tampered)
        let refreshPayload: JwtPayload;
        try {
            refreshPayload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as JwtPayload;
        } catch {
            return NextResponse.json(
                { error: "Refresh token expired - please login again" },
                { status: 403 }
            );
        }

        if (!refreshPayload._id) {
            return NextResponse.json(
                { error: "Malformed token - please login again" },
                { status: 403 }
            );
        }

        await connectDB();

        // Access token valid — fast path
        if (accessToken) {
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
                // Access token expired — fall through
            }
        }

        // Access token expired — return 401 so ApiClient interceptor
        // calls /api/auth/refreshToken to rotate, then retries
        return NextResponse.json(
            { error: "Access token expired" },
            { status: 401 }
        );

    } catch (error) {
        console.error("Session check error:", error);
        return NextResponse.json(
            { error: "Session check failed" },
            { status: 500 }
        );
    }
}