import connectDB from "@/db/dbConfig";
import { SpecialAppearence } from "@/models/specialAppearence.model";
import { NextResponse } from "next/server";

connectDB();
export async function GET() {
    try {
        const requests = await SpecialAppearence.find();

        if (!requests) {
            return NextResponse.json({ error: "Failed to find the requests from the database" }, { status: 402 })
        }
        return NextResponse.json({ data: requests }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to Get the Requests" }, { status: 500 })
    }
}