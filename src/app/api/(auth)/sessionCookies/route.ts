import connectDB from "@/db/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {
        const cookieStore = await cookies();

        const authToken: any = cookieStore.get('accessToken')?.value;
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
        console.log("Error in session cookies : ", error)
        throw NextResponse.json(
            { error: `Error getting the session cookies : ${error}` },
            { status: 500 }
        )
    }

}