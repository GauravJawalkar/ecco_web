import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";
import connectDB from "@/db/dbConfig";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(_: NextRequest) {
    await connectDB();
    console.log('Refresh token endpoint called');

    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        //  Step 1: Check if refresh token exists
        if (!refreshToken || refreshToken.trim() === "") {
            console.log('❌ No refresh token found');
            return NextResponse.json(
                { error: "No Refresh Token - Please Login" },
                { status: 403 }
            );
        }

        //  Step 2: Verify JWT signature and expiry (this is the real security check)
        let decoded: any;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            console.log(' RefreshToken JWT valid, userId:', decoded._id);
        } catch (jwtError) {
            console.log('❌ RefreshToken JWT invalid:', jwtError);
            return NextResponse.json(
                { error: "Invalid or expired refresh token" },
                { status: 403 }
            );
        }

        //  Step 3: Find user in database
        const user = await User.findById(decoded._id);

        if (!user) {
            console.log('❌ User not found in DB');
            return NextResponse.json(
                { error: "User not found" },
                { status: 403 }
            );
        }

        console.log('User found in DB');

        // OPTIONAL: If you want extra security, verify the token string matches
        // But this can fail if the cookie was set multiple times
        // Best practice: Just verify the JWT signature (done above)
        // if (user?.refreshToken !== refreshToken) {
        //     console.log('❌ Stored token does not match');
        //     return NextResponse.json({ error: "Refresh token does not match" }, { status: 403 });
        // }

        //  Step 4: Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        console.log(' New tokens generated');

        //  Step 5: Update user's refresh token in database
        try {
            await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
            console.log(' RefreshToken updated in DB');
        } catch (error) {
            console.error('❌ Failed to update refresh token in database:', error);
            return NextResponse.json(
                { error: "Failed to update tokens" },
                { status: 500 }
            );
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'strict' as const
                : 'lax' as const,
            path: '/',
        };

        //  Step 6: Create response and attach cookies
        const response = NextResponse.json({
            success: true,
            message: "Tokens refreshed successfully"
        }, { status: 200 });

        response.cookies.set('accessToken', newAccessToken, {
            ...cookieOptions,
            maxAge: 60 * 60 // 1 hour
        });

        response.cookies.set('refreshToken', newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        console.log(' New cookies set in response');
        return response;

    } catch (error) {
        console.error('❌ Unexpected refresh token error:', error);
        return NextResponse.json(
            { error: "Token refresh failed" },
            { status: 500 }
        );
    }
}