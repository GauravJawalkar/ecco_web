import { BecomeSeller } from "@/models/becomeSeller.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const sellers = await BecomeSeller.find();

        if (!sellers) {
            return NextResponse.json({ error: "No seller requests found in database" }, { status: 401 })
        }

        return NextResponse.json({ data: sellers }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the seller requests" }, { status: 500 })
    }

}