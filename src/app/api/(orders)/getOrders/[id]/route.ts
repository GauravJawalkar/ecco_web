import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, params: { params: { id: string } }) {
    try {
        const { id } = await params.params;

        if (!id) {
            return NextResponse.json({ error: "Unauthorized Cant access the orders" }, { status: 400 })
        }

        

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch the orders from the database" }, { status: 500 })
    }
}