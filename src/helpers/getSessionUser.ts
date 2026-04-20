import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";

export type SessionResult =
    | { status: "ok"; user: Record<string, any> }
    | { status: "refresh_needed"; userId: string }
    | { status: "logged_out" };

export async function getSessionUser(): Promise<SessionResult> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken?.trim()) return { status: "logged_out" };

        // Validate refresh token
        let refreshPayload: JwtPayload;
        try {
            refreshPayload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as JwtPayload;
        } catch {
            return { status: "logged_out" };
        }

        await connectDB();

        // Case 1: Access token valid
        if (accessToken?.trim()) {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET!
                ) as JwtPayload;

                const user = await User.findById(decoded._id)
                    .select("-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry")
                    .lean();

                if (!user) return { status: "logged_out" };
                return { status: "ok", user: JSON.parse(JSON.stringify(user)) };
            } catch {
                // Access token expired — fall through
            }
        }

        // Case 2: Access token missing/expired — check if refresh token is in DB
        const dbUser = await User.findById(refreshPayload._id);
        if (!dbUser) return { status: "logged_out" };

        if (dbUser.refreshToken !== refreshToken) {
            return { status: "logged_out" };
        }

        // Signal to layout that a token rotation is needed
        return { status: "refresh_needed", userId: String(dbUser._id) };

    } catch {
        return { status: "logged_out" };
    }
}