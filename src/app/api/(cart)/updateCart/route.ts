import connectDB from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    await connectDB()
    try {
        const reqBody = await request.json();

        const { quantity, _id } = reqBody;

        if (!quantity || !_id) {
            return NextResponse.json({ error: "Quantity is required" }, { status: 400 })
        }

    } catch (error) {
        return NextResponse.json({ error: `Error updating the cart : ${error}` }, { status: 500 })
    }
}