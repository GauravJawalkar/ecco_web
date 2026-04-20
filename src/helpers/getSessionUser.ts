import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionResponse {
    status: "ok" | "refresh_needed" | "logged_out";
    user?: Record<string, any>;
    userId?: string;
}

export async function getSessionUser(): Promise<SessionResponse> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // Case 1: No tokens at all → logged out
        if (!accessToken && !refreshToken) {
            return { status: "logged_out" };
        }

        // Case 2: accessToken exists and valid
        if (accessToken) {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET!
                ) as JwtPayload;

                // Don't fetch user here — just verify token is valid
                // UserStoreInitializer will call sessionCookies to get full user data
                return {
                    status: "ok",
                    user: { _id: decoded._id } as any // Minimal data, full sync happens in sessionCookies
                };
            } catch {
                // accessToken invalid, try refreshToken
            }
        }

        // Case 3: accessToken invalid but refreshToken exists → needs refresh
        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET!
                ) as JwtPayload;

                return {
                    status: "refresh_needed",
                    userId: decoded._id
                };
            } catch {
                // refreshToken also invalid
                return { status: "logged_out" };
            }
        }

        return { status: "logged_out" };

    } catch (error) {
        console.error("Error in getSessionUser:", error);
        return { status: "logged_out" };
    }
}