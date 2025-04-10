// /app/api/me/route.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const user = (await cookies()).get('user')?.value;

    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const userData = JSON.parse(user)

    return NextResponse.json({ data: userData }, { status: 200 });
}
