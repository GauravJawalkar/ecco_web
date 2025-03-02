import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { newPassword, OTP, email } = reqBody;

        if (!email || !OTP) {
            return NextResponse.json({ error: "All the fields are required" }, { status: 404 })
        }


    } catch (error) {
        return NextResponse.json({ error: "Failed to reset the password" }, { status: 500 })
    }
}