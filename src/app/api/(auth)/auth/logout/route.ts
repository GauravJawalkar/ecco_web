import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value?.trim();

        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET!
                ) as JwtPayload;

                if (decoded._id) {
                    await connectDB();
                    await User.findByIdAndUpdate(decoded._id, { refreshToken: null });
                }
            } catch {
                // Token already expired — DB cleanup not needed
            }
        }

        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
        response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

        return response;

    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to logout" },
            { status: 500 }
        );
    }
}