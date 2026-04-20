import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
            path: '/',
            maxAge: 0 // Immediate expiration
        };

        // Create response FIRST, then set cookies on it
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        });

        // Use response.cookies.set() (works in Route Handlers)
        response.cookies.set('accessToken', '', cookieOptions);
        response.cookies.set('refreshToken', '', cookieOptions);

        return response;

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to logout"
        }, { status: 500 });
    }
}