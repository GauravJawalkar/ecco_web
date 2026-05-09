import connectDB from "@/db/dbConfig";
import { generateAccessAndRefreshToken } from "@/helpers/tokensGenerator";
import { User } from "@/models/user.model";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

    try {
        const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
        });

        const googleUser: any = jwt.decode(tokenRes.data.id_token);

        await connectDB();

        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = await User.create({
                googleId: googleUser.sub,
                email: googleUser.email,
                name: googleUser.name,
                avatar: googleUser.picture,
                password: "123",
                store: false,
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const isProd = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? ("strict" as const) : ("lax" as const),
            path: "/",
        };

        // Must use response.cookies.set — cookieStore.set is unreliable on redirects
        const response = NextResponse.redirect(new URL("/", request.url));

        response.cookies.set("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: ACCESS_MAX_AGE,
        });

        response.cookies.set("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: REFRESH_MAX_AGE,
        });

        return response;

    } catch (err) {
        console.error("Google auth error:", err);
        return NextResponse.json({ error: "Auth failed" }, { status: 500 });
    }
}