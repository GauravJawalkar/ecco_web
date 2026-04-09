import { NextResponse } from "next/server";

export async function GET() {
    try {
        const redirect_uri = process.env.GOOGLE_REDIRECT_URI;
        const client_id = process.env.GOOGLE_CLIENT_ID;

        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', client_id!);
        url.searchParams.set('redirect_uri', redirect_uri!);
        url.searchParams.set('scope', 'openid email profile');
        url.searchParams.set('prompt', 'select_account'); // ✅ Always show account picker
        url.searchParams.set('access_type', 'offline');   // ✅ Ensures refresh token is issued

        return NextResponse.redirect(url.toString());
    } catch (error) {
        return NextResponse.json({ error: `Error in callback: ${error}` }, { status: 500 });
    }
}