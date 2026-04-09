import connectDB from '@/db/dbConfig';
import { generateAccessAndRefreshToken } from '@/helpers/tokensGenerator';
import { User } from '@/models/user.model';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

    try {
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
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

        // ✅ Use shared generator — sets refreshToken on user doc and returns both tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const cookieStore = await cookies();

        // ✅ Remove stale 'user' cookie — layout decodes JWT directly, this was never read
        cookieStore.delete('user');

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 60 * 60, // 1 hour — matches email/password login
        });

        // ✅ Set refreshToken — without this getSessionUser() always returns null
        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // ✅ Go straight to home — UserStoreInitializer in layout handles hydration
        return NextResponse.redirect(new URL('/', request.url));

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }
}