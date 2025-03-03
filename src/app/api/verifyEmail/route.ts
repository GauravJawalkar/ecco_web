import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

        

        const reqBody = await request.json();

        const { id, OTP, } = reqBody;

        if (!id && !OTP) {
            return NextResponse.json({ error: "Id and OTP fields are required" }, { status: 402 })
        }



    } catch (error) {
        return NextResponse.json(
            { error: "Failed to verify the email" },
            { status: 500 }
        )
    }
}