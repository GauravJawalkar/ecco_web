import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // ✅ Case 1: No refresh token — user is logged out
        if (!refreshToken || refreshToken.trim() === "") {
            return NextResponse.json(
                { error: "No refresh token - please login again" },
                { status: 403 }
            );
        }

        // ✅ Case 2: Validate refresh token
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

        // ✅ Case 3: Access token is valid — return user immediately
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
                // Access token invalid but that's ok, we'll refresh
            }
        }

        // ✅ Case 4: Access token missing/expired but refresh is valid
        // Trigger refresh and return user
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

        // Return signal that refresh is needed (frontend will trigger it)
        return NextResponse.json(
            {
                message: "Access token missing - refresh needed",
                user: null
            },
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