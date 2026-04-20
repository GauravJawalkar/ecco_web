"use server"

import { cookies } from "next/headers";
import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";

export type RefreshResult =
    | { status: "ok"; user: Record<string, any> }
    | { status: "logged_out" };

export async function refreshSession(userId: string): Promise<RefreshResult> {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) return { status: "logged_out" };

        const dbUser = await User.findById(userId);
        if (!dbUser || dbUser.refreshToken !== refreshToken) {
            return { status: "logged_out" };
        }

        // Rotate both tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(dbUser._id);

        await User.findByIdAndUpdate(dbUser._id, { refreshToken: newRefreshToken });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" as const : "lax" as const,
            path: "/",
        };

        // ✅ This actually works — Server Actions CAN set cookies
        cookieStore.set("accessToken", newAccessToken, {
            ...cookieOptions,
            maxAge: 60 * 60,
        });

        cookieStore.set("refreshToken", newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60,
        });

        const { password, refreshToken: _rt, forgotPasswordOTP, forgotPasswordOTPexpiry,
            emailVerificationOTP, emailVerificationOTPexpiry, ...safeUser } =
            dbUser.toObject();

        return { status: "ok", user: JSON.parse(JSON.stringify(safeUser)) };

    } catch {
        return { status: "logged_out" };
    }
}