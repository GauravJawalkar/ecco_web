import connectDB from "@/db/dbConfig";
import { SpecialAppearence } from "@/models/specialAppearence.model";
import { NextResponse } from "next/server";

connectDB()
export async function GET() {
    try {

        const splProducts = await SpecialAppearence.find({ setActive: true });

        if (!splProducts) {
            return NextResponse.json({ error: "No SPl products from DB" }, { status: 402 })
        }

        if (splProducts.length === 0) {
            return NextResponse.json({ error: "No SPl products found" }, { status: 401 })
        }

        return NextResponse.json({ data: splProducts }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the SPl products from DB" }, { status: 500 })
    }
}