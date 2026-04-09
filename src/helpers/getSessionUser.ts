import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";

export async function getSessionUser(): Promise<Record<string, any> | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken?.trim()) return null;

        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        } catch {
            return null;
        }

        if (!accessToken?.trim()) return null;

        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            ) as JwtPayload;

            await connectDB();

            const user = await User.findById(decoded._id)
                .select("-password -refreshToken -forgotPasswordOTP -forgotPasswordOTPexpiry -emailVerificationOTP -emailVerificationOTPexpiry")
                .lean(); // Returns plain JS object, no Mongoose methods

            if (!user) return null;

            // Serialize manually — converts ObjectId, Date, Buffer to primitives
            return JSON.parse(JSON.stringify(user));

        } catch {
            return null;
        }
    } catch {
        return null;
    }
}