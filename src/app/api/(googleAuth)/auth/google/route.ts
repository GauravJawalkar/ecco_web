import { NextResponse } from "next/server";

export async function GET() {
    try {
        const redirect_uri = process.env.GOOGLE_REDIRECT_URI;
        const client_id = process.env.GOOGLE_CLIENT_ID;

        const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=openid email profile`;

        return NextResponse.redirect(url);
    } catch (error) {
        NextResponse.json({ error: `Error in CAllBAck : ${error}` }, { status: 500 })
    }
}