import connectDB from "@/db/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
    await connectDB();
    try {
        const cookieStore = await cookies();

        const authToken: string | undefined = cookieStore.get('accessToken')?.value;
        return NextResponse.json(
            {
                message: "User Details",
                user: authToken,
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return NextResponse.json(
            { error: `Error getting the session cookies : ${error}` },
            { status: 500 }
        )
    }

}