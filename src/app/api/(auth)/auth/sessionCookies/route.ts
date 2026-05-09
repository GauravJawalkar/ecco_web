import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value?.trim();
        const refreshToken = cookieStore.get("refreshToken")?.value?.trim();

        // Case 1: No refresh token — fully logged out
        if (!refreshToken) {
            return NextResponse.json(
                { error: "No refresh token - please login again" },
                { status: 403 }
            );
        }

        // Case 2: Verify refresh token is cryptographically valid
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

        // Case 3: Access token valid — fast path, no DB write needed
        if (accessToken) {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET!
                ) as JwtPayload;

                const user = await User.findById(decoded._id).select(
                    "-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry"
                ).lean();

                if (user) {
                    return NextResponse.json(
                        { message: "User session valid", user },
                        { status: 200 }
                    );
                }
            } catch {
                // Access token expired — fall through to refresh
            }
        }

        // Case 4: Access token expired/missing — refresh using refresh token
        const dbUser = await User.findById(refreshPayload._id);

        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found - please login again" },
                { status: 403 }
            );
        }

        // Rotation check — if tokens don't match, session was invalidated
        if (!dbUser.refreshToken || dbUser.refreshToken !== refreshToken) {
            console.error("Rotation check failed — DB:", dbUser.refreshToken, "| Cookie:", refreshToken);
            return NextResponse.json(
                { error: "Session invalid - please login again" },
                { status: 403 }
            );
        }

        // generateAccessAndRefreshToken saves new refreshToken to DB internally
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(dbUser._id);

        const freshUser = await User.findById(dbUser._id).select(
            "-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry"
        ).lean();

        const isProd = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? ("strict" as const) : ("lax" as const),
            path: "/",
        };

        const response = NextResponse.json(
            { message: "Session refreshed", user: freshUser },
            { status: 200 }
        );

        response.cookies.set("accessToken", newAccessToken, {
            ...cookieOptions,
            maxAge: ACCESS_MAX_AGE,
        });

        response.cookies.set("refreshToken", newRefreshToken, {
            ...cookieOptions,
            maxAge: REFRESH_MAX_AGE,
        });

        return response;

    } catch (error) {
        console.error("Session check error:", error);
        return NextResponse.json({ error: "Session check failed" }, { status: 500 });
    }
}