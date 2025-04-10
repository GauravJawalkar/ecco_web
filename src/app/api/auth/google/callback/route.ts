import connectDB from '@/db/dbConfig';
import { User } from '@/models/user.model';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const {
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI,
        JWT_SECRET,
    } = process.env;

    try {
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const { id_token } = tokenRes.data;
        const googleUser: any = jwt.decode(id_token);

        await connectDB();

        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = await User.create({
                googleId: googleUser.sub,
                email: googleUser.email,
                name: googleUser.name,
                avatar: googleUser.picture,
                password: "123"
            });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET as string, { expiresIn: '7d' });

        // Set cookie (HttpOnly)
        (await
            cookies()).set({
                name: 'user',
                value: JSON.stringify({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, token: user.accessToken }),
                httpOnly: true,
                path: '/',
            });

        (await
            cookies()).set({
                name: 'accessToken',
                value: token,
                httpOnly: true,
                path: '/',
            });


        return new Response(null, {
            status: 302,
            headers: {
                Location: '/post-auth-redirect',
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }
}