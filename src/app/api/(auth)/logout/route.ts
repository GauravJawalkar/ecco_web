import connectDB from "@/db/dbConfig";
import { User } from "@/models/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {

        const cookieStore = await cookies();

        const accessToken: any = cookieStore.get('accessToken')?.value
        const refreshToken: any = cookieStore.get('refreshToken')?.value
        const user: any = cookieStore.get('user')?.value


        accessToken && cookieStore.delete('accessToken');
        refreshToken && cookieStore.delete('refreshToken');
        user && cookieStore.delete('user');

        return NextResponse.json(
            { data: "Logout Successful" },
            { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}