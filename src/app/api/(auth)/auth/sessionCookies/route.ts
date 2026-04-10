import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        // Case 1: No refresh token — user must log in
        if (refreshToken?.trim() === "" || refreshToken?.trim() === undefined) {
            return NextResponse.json(
                { error: "No refresh token - please login again" },
                { status: 403 }
            );
        }

        console.log("Got till here");

        // Case 2: Validate refresh token — if expired/invalid, force logout
        try {
            console.log("token checkting")
            console.log("🚀 ~ GET ~ process.env.REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET)
            const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            console.log("TTtoken:", token)
        } catch {
            // Covers: TokenExpiredError, JsonWebTokenError, NotBeforeError
            return NextResponse.json(
                { error: "Refresh token expired - please login again" },
                { status: 403 }
            );
        }

        // Case 3: No access token but refresh token is valid — trigger refresh
        if (accessToken?.trim() === "" || accessToken?.trim() === undefined) {
            return NextResponse.json(
                { message: "Access token missing - refresh needed" },
                { status: 401 }
            );
        }

        // Case 4: Verify access token and return decoded payload (not raw token)
        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            ) as JwtPayload;

            // Strip internal JWT fields before sending to client
            const { iat, exp, ...userPayload } = decoded;

            return NextResponse.json(
                { message: "User Details", user: userPayload },
                { status: 200 }
            );
        } catch {
            return NextResponse.json(
                { message: "Token expired - refresh needed" },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: `Error getting the session cookies: ${error}` },
            { status: 500 }
        );
    }
}