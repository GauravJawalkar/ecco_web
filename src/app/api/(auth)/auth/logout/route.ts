import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();

        // Cookie options matching your login settings
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
            path: '/',
            maxAge: 0 // Immediate expiration
        };

        // Always clear cookies regardless of their current state
        cookieStore.set('accessToken', '', cookieOptions);
        cookieStore.set('refreshToken', '', cookieOptions);
        cookieStore.set('user', '', cookieOptions);

        return NextResponse.json({
            success: true,
            message: "Logged out successfully"
        });


    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to logout"
        }, {
            status: 500
        });
    }
}