import connectDB from "@/db/dbConfig";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { User } from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_MAX_AGE = 15 * 60;           // 15 minutes
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;  // 7 days

export async function POST() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value?.trim();

        if (!refreshToken) {
            return NextResponse.json(
                { error: "No refresh token - please login again" },
                { status: 403 }
            );
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as JwtPayload;
        } catch {
            return NextResponse.json(
                { error: "Refresh token expired - please login again" },
                { status: 403 }
            );
        }

        if (!decoded._id) {
            return NextResponse.json(
                { error: "Malformed token - please login again" },
                { status: 403 }
            );
        }

        const user = await User.findById(decoded._id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found - please login again" },
                { status: 403 }
            );
        }

        // Rotation check — if mismatch, token was already rotated elsewhere
        if (!user.refreshToken || user.refreshToken !== refreshToken) {
            console.error("Rotation check failed — DB:", user.refreshToken, "| Cookie:", refreshToken);
            return NextResponse.json(
                { error: "Session invalid - please login again" },
                { status: 403 }
            );
        }

        // generateAccessAndRefreshToken saves new refreshToken to DB internally
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        const isProd = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? ("strict" as const) : ("lax" as const),
            path: "/",
        };

        const response = NextResponse.json(
            { success: true, message: "Tokens refreshed successfully" },
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
        console.error("Token refresh error:", error);
        return NextResponse.json(
            { error: "Token refresh failed" },
            { status: 500 }
        );
    }
}