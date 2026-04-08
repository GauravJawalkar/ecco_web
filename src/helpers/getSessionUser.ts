import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getSessionUser(): Promise<JwtPayload | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken?.trim()) return null;

        // Verify refresh token is still valid
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        } catch {
            return null;
        }

        if (!accessToken?.trim()) return null;

        // Verify and decode access token
        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            ) as JwtPayload;
            const { iat, exp, ...userPayload } = decoded;
            return userPayload;
        } catch {
            return null; // Expired — client interceptor will refresh on first real API call
        }
    } catch {
        return null;
    }
}