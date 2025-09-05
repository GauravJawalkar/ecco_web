import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        // Case 1: No refresh token at all - user should be logged out
        if (!refreshToken || refreshToken.trim() === "") {
            return NextResponse.json(
                { error: "No refresh token - please login again" },
                { status: 403 }
            );
        }

        // Case 1.1: Check if refresh token is expired
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            // Token is valid, continue with other checks...
        } catch (jwtError) {
            // Token is expired, invalid, or malformed - logout user
            return NextResponse.json(
                { error: "Refresh token expired - please login again" },
                { status: 403 }
            );
        }

        // Case 2: No access token but has refresh token - token refresh needed
        if (!accessToken || accessToken.trim() === "") {
            return NextResponse.json(
                { message: "Access token missing - refresh needed" },
                { status: 401 }
            );
        }

        // Case 3: Verify access token
        try {
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
            return NextResponse.json(
                {
                    message: "User Details",
                    user: accessToken,
                },
                { status: 200 }
            );
        } catch (jwtError) {
            // Token invalid/expired
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